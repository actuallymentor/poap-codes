import { log } from "./helpers"

const { localStorage: store } = window
export const set_item = async ( name, content ) => {

    try {

        const stringified = JSON.stringify( content )
        await store.setItem( name, stringified )
        log( `Successfully set ${ name } to:`, stringified )
        return { content: false }

    } catch( e ) {
        log( `Error storing item in localstorage: `, e )
        return { error: e.message }
    }

}

export const get_item = async ( name, format='json' ) => {

    try {

        let content = await store.getItem( name )
        if( format == 'json' ) content = JSON.parse( content )
        else content = `${ content }`

        log( `Successfully got ${ name } to:`, content )
        return { content }

    } catch( e ) {
        log( `Error storing item in localstorage: `, e )
        return { error: e.message }
    }

}