import { useEffect, useState } from "react"
import { log } from "../modules/helpers";
import { get_item } from "../modules/local-storage";

export function useLastKnownCodeStatuses( last_update ) {

    const [ last_known_codes, set_last_known_codes ] = useState()

    useEffect( (  ) => {

        let cancelled = false;
    
        ( async () => {
    
            try {
    
                const { content, error } = await get_item( 'last_known_code_statuses' )
                if( cancelled ) return
                if( error ) throw new Error( error )
                log( `Found code statuses in localstorage: `, content )
                set_last_known_codes( content )
    
            } catch( e ) {
                log( `Error getting last known code statuses: `, e )
            }
    
        } )( )
    
        return () => cancelled = true
    
    }, [ last_update ] )

    return last_known_codes

}

export function useLastKnownCodeEvent() {

    const [ last_known_code_event, set_last_known_code_event ] = useState()

    useEffect( (  ) => {

        let cancelled = false;
    
        ( async () => {
    
            try {
    
                const { content, error } = await get_item( 'last_known_code_event' )
                if( cancelled ) return
                if( error ) throw new Error( error )
                log( `Found old event in localstorage: `, content )
                set_last_known_code_event( content )
    
            } catch( e ) {
                log( `Error getting last known code statuses: `, e )
            }
    
        } )( )
    
        return () => cancelled = true
    
    }, [] )

    return last_known_code_event

}