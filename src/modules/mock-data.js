const random_characters = length => {

    const chars = `abcdefghijklmnopqrstuvwxyz0123456789`
    const randoms = Array( length ).fill( 0 ).map( f => {
        return chars.charAt( Math.floor( Math.random() * chars.length ) )
    } )
    return randoms.join( '' )

}
export const generate_mock_codes = amount => Array( amount ).fill( 0 ).map( f => {
    const claimed = !!( Math.random() > .5 )
    return {
        id: Math.random(),
        qr_hash: random_characters( 6 ),
        claimed,
        claimed_date: claimed ? new Date().toDateString() : undefined
    }
} )