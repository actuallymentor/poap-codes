// Firebase interactors
const functions = require( 'firebase-functions' )
const { db, dataFromSnap } = require( './firebase' )
const { log, dev, wait } = require( './helpers' )

// Secrets
const { auth0, poap } = functions.config()

// Libraries
const fetch = require( 'isomorphic-fetch' )

// Get auth token from auth0
async function getAccessToken() {

	// Get API secrets
	const { access_token, expires } = await db.collection( 'secrets' ).doc( 'poap-api' ).get().then( dataFromSnap )
	const { client_id, client_secret, endpoint } = auth0

	// If token is valid for another hour, keep it
	if( expires > ( Date.now() + 1000 * 60 * 10 ) ) return access_token

	// If the access token expires soon, get a new one
	const options = {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify( {
			audience: auth0.audience,
			grant_type: 'client_credentials',
			client_id: client_id,
			client_secret: client_secret
		} )
	}
	log( `Getting access token at ${ endpoint } with `, options )
	const { access_token: new_access_token, expires_in, ...rest } = await fetch( endpoint, options ).then( res => res.json() )
	log( `New token: `, new_access_token, ' unexpected output: ', rest )

	// If no access token, error
	if( !new_access_token ) throw new Error( JSON.stringify( rest ) )

	// Set new token to firestore cache
	await db.collection( 'secrets' ).doc( 'poap-api' ).set( {
		access_token: new_access_token,
		expires: Date.now() + ( expires_in * 1000 ),
		updated: Date.now()
	}, { merge: true } )

	return new_access_token

}


// Health helper
exports.live_access_token = async f => {

	const token = await getAccessToken()
	return !!token

}

/**
* Authenticated API call in JSON format
* @param {string} endpoint Endpoint to call, e.g. /events
* @param {(string|Object)} data Data to send in the request body
* @param {string} [method=GET] - HTTP verb to call with
* @param {string} [format=json] - format to send the body in
* @returns {Object} response API response as documented at https://api.poap.xyz/documentation/static/index.html#/ and https://github.com/poap-xyz/poap-server/blob/development/src/apps/events/routes.ts#L57
* @returns {string} response.error Error message if one is given
* @returns {string} response.message Contains error details if this was an error
*/
exports.call_poap_endpoint = async ( endpoint='', data, method='GET', format='json', throw_on_error=false ) => {

		/* ///////////////////////////////
		// Validations */
		const has_non_get_data = ( method != 'GET' && data )
		const has_get_data = method == 'GET' && data
		const has_non_json_data = data && typeof data != 'object'
		if( has_non_json_data ) throw new Error( `API data must be formatted as json` )

		/* ///////////////////////////////
		// Generate API url */
		let apiUrl = 'https://api.poap.tech'
		if( has_get_data ) {

			const queryString = Object.keys( data ).reduce( ( acc, key ) => {

				return acc + `${ key }=${ data[ key ] }&`

			}, '?' )

			// Append querystring to url
			endpoint += queryString

		}

		/* ///////////////////////////////
		// Authentication */
		const access_token = await getAccessToken()
		log( `Calling ${ apiUrl }${ endpoint } with token ${ access_token?.slice( 0, 10 ) } and data ${ data && Object.keys( data ).join( ', ' ) }` )

		/* ///////////////////////////////
		// Call the API
		// /////////////////////////////*/

		// Build headers
		let headers = {
			
			// authorization for cloudflare */
			'X-API-Key': `${ poap?.api_key }`,

			// Authorize with Bearer access token
			Authorization: `Bearer ${ access_token }`,

			// If this is a request with json data
			...( has_non_get_data && format == 'json' && { "Content-Type": "application/json" } )

		}

		// Build data format
		let request_data = {}
		// if( data.image ) data.image = Buffer.from( data.image, 'base64' ).toString( 'binary' )
		if( has_non_get_data && format == 'json' ) request_data.body = JSON.stringify( data )



		// Execute request
		const url = `${ apiUrl }${ endpoint }`
		const options = {
			method: method,
			headers: headers,
			...request_data
		}

		log( `Calling ${ url } with `, options )
		const res = await fetch( url, options )
		const backup_res = res.clone()
		log( `Response received, parsing...` )

		// Try to access response as json first
		let json = {}
		try {
			log( `Parsing response json...` )
			const json_response = await Promise.race( [
				res.json(),
				wait( 1000 * 10 ).then( f => false )
			] )
			if( json_response ) {
				log( `Json parse success` )
				json = json_response
			}
			else {
				log( `Json parse failed, trying text parsing` )
				const text_response = await backup_res.text()
				log( `Text parsed, trying to parse text as json` )
				const json_of_text = JSON.parse( text_response )
				json = json_of_text
			}
			log( `Succesfully parsed response as json` )
		} catch {
			json.error = `Unknown API error, this is probably a POAP API issue`
			log( `💥 Invalid JSON response on ${ endpoint }, this should never happen.` )
			// if( local ) {
			// 	const text_response = await backup_res.text()
			// 	log( `Errored esponse: `, text_response )
			// }
		}

		log( 'API json response: ', dev ? json : 'redacted' )

		// Handle errors from API
		const { error, message, Message, statusCode } = json
		const an_error = message || Message || error || statusCode
		if( an_error ) {

			log( `Api encountered an error: ${ an_error }, ${ throw_on_error ? ' Throwing error' : 'Not throwing error' }` )
			if( throw_on_error ) throw new Error( an_error )
			return { error: an_error, statusCode }
		}

		return json


}