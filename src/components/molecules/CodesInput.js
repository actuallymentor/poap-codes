import { useEffect, useState } from 'react'
import { log } from '../../modules/helpers'
import { get_event_data_from_code, get_code_statuses } from '../../modules/firebase'
import Papa from 'papaparse'
import Input from '../atoms/Input'
import { set_item } from '../../modules/local-storage'


export default ( { label, info, on_codes, on_event, ...props } ) => {

    const [ codes, set_codes ] = useState(  )
    const [ file, set_file ] = useState(  )
    const [ filename, set_filename ] = useState( 'codes.txt' )
    const [ loading, set_loading] = useState(  )

    // File validations and loading
    useEffect( f => {

        let cancelled = false
        if( !file ) return

        ( async f => {

            try {

                // Loading animation
                set_loading( `Checking your codes...` )

                // Validations
                const { name } = file
                if( !name.includes( '.csv' ) && !name.includes( '.txt' ) ) throw new Error( `Please upload a .txt or .csv file` )

                // Set filename to state
                set_filename( name )

                // Load csv data
                let data = await parse_csv_to_codes( file )
                log( 'Raw codes loaded: ', data )

                // Remove website prefix
                data = data.map( code => {
                    if( !code ) return ''
                    const [ code_segment_only ] = `${ code }`.match( /(?:^|(?<=\/claim\/))[a-zA-Z0-9]{6}/ ) || []
                    return code_segment_only
                } )

                // Take out empty lines
                data = data.filter( code => `${ code }`.length != 0 )

                // Find faulty codes
                const faulty_codes = data.filter( code => !code.match( /\w{6}/ )  )

                // Let user know about faulty codes
                if( faulty_codes.length ) {

                    log( 'Faulty codes codes: ', faulty_codes )
                    throw new Error( `${ faulty_codes.length } invalid codes, example faulty code: ${ faulty_codes[0] }` )

                }

                // Validated and sanetised codes
                log( 'Sanetised codes: ', data )
                if( !data.length ) throw new Error( `This file is empty` )
                if( !cancelled ) set_codes( data )

                // Load event data based on codes
                set_loading( `Checking ${ data.length } codes...` )
                const { data: { event, error } } = await get_event_data_from_code( data[0] )
                log( 'Code data received ', event )
                if( error ) throw new Error( error )
                if( !event ) throw new Error( `This event has expired` )

                // Set event details to state
                if( event.name ) set_filename( event.name )
                if( on_event ) on_event( event )
                set_loading( `Getting ${ data.length } code statuses for "${ event.name }"` )

                // Get code statusses
                const { data: { statuses, error: status_error } } = await get_code_statuses( data )
                if( status_error ) throw new Error( status_error )

                // Add expiry status based on event date
                const expired = new Date( event.expiry_date ) < Date.now()

                // Keep only codes with data (in case API broke)
                const sanitised_statuses = statuses.filter( ( { qr_hash, event_id } ) => !!qr_hash && !!event_id )

                // Annotate with expiry data
                const annotated_statuses = sanitised_statuses.map( status => ( { ...status, expired } ) )
                
                // Sort code statuses by claim status
                annotated_statuses.sort( ( { claimed } ) => claimed ? 1 : -1 )
                log( `Code statuses: `, statuses )

                if( !cancelled ) set_loading( false )

                // Call on_codes callback
                if( on_codes ) on_codes( annotated_statuses )

                // Save new codes to localstorage
                await set_item( 'last_known_code_statuses', annotated_statuses )
                await set_item( 'last_known_code_event', event )


            } catch( e ) {

                log( 'Validation error ', e, ' for ', file )
                if( !cancelled ) set_codes( undefined )
                if( !cancelled ) set_loading( false )
                if( !cancelled ) set_file( undefined )
                return alert( e.message )

            }

        } )(  )

        return () => cancelled = true

    }, [ file ] )

    // ///////////////////////////////
  // Component functions
  // ///////////////////////////////
    async function parse_csv_to_codes( file ) {
    return new Promise( ( resolve, reject ) => {

        // parse csv
        Papa.parse( file, {

            // Assuming it is a newline delimited file, the first entry of each line is the code
            complete: ( { data } ) => resolve( data.map( line => line[0] ) ),
            error: err => reject( err )

        } )

    } )
    }

    return <Input
        { ...props }
        animate={ !!loading }
        highlight={ !codes } 
        label={ label || 'Select your codes.txt file:' }
        accept=".csv,.txt"
        title={ loading || file && codes && `[ ${filename} ]` }
        onClick={ !filename ? undefined : () => set_file( undefined ) }
        onChange={ ( { target } ) => set_file( target.files[0] ) } type='file'
    />
}