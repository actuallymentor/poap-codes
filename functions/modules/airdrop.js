const { throw_on_failed_app_check } = require("./firebase")
const { log, throttle_and_retry } = require("./helpers")
const { call_poap_endpoint } = require("./poap_api")

exports.airdrop_to_address_list = async ( data, context ) => {

    try {

        /* ///////////////////////////////
        // Validations */
        throw_on_failed_app_check( context )
        const { drop_id, edit_code, list_of_addresses } = data
        if( !drop_id || !edit_code ) throw new Error( `Missing drop details` )
        if( !list_of_addresses.length ) throw new Error( `Address list must have at least one entry` )
        const addresses = list_of_addresses.split( /,|\n/ ).filter( address => !!address ).map( address => address.trim() )

        /* ///////////////////////////////
        // Get codes of event */
        const codes = await call_poap_endpoint( `/event/${ drop_id }/qr-codes`, { secret_code: edit_code }, 'POST' )
        const unclaimed_codes = codes.filter( ( { claimed } ) => !claimed )
        log( `Found ${ unclaimed_codes.length } unclaimed codes, example: `, unclaimed_codes[0] )

        // Check if we have enough codes
        if( addresses.length > unclaimed_codes.length ) throw new Error( `There are ${ unclaimed_codes.length } codes for ${ addresses.length }, that is too little to complete the airdrop by ${ addresses.length - unclaimed_codes.length } codes` )

        /* ///////////////////////////////
        // Claim POAP codes  */
        const failed_airdrops = []
        const airdrop_queue = addresses.map( ( address, address_index ) => async () => {

            // Try to airdrop code, register fails
            const { qr_hash } = unclaimed_codes[ address_index ]

            try {

                const { secret } = await call_poap_endpoint( `/actions/claim-qr`, { qr_hash } )
                const claim_response = await call_poap_endpoint( `/actions/claim-qr`, {
                    secret,
                    qr_hash,
                    address
                }, 'POST', 'json', false )

                if( claim_response.error ) throw new Error( claim_response.error )

            } catch( e ) {

                log( `Error claiming airdrop: `, e )
                failed_airdrops.push( {
                    address,
                    qr_hash,
                    reason: e.message
                } )

            }

        } )

        /* ///////////////////////////////
        // Run airdrop */
        await throttle_and_retry( airdrop_queue, 5, `airdrop`, 1, 10 )

        log( `Airdrop complete with ${ failed_airdrops.length } failed airdrops, eg: `, failed_airdrops[ 0 ] )
        return { success: true, failed_airdrops }


    } catch( e ) {
        log( `Error airdropping codes: `, e )
        return { error: e.message }
    }

}