const { throw_on_failed_app_check } = require( './firebase' )
const { call_poap_endpoint } = require( './poap_api' )
const { throttle_and_retry } = require( './helpers' )

// Libraries
// ///////////////////////////////
// Code helpers
// ///////////////////////////////

// Remote api checker, this ALWAYS resolves
// this is because I am not sure that this API will not suddenly be throttled or authenticated.
const check_code_status = async code => {

	// Get API data
	return call_poap_endpoint( `/actions/claim-qr`, { qr_hash: code } )

}

// Publically exposed code check
exports.check_code_status = function( code, context ) {

	throw_on_failed_app_check( context )
	return check_code_status( code )

}

/* ///////////////////////////////
// Get event data from code
// /////////////////////////////*/
exports.get_event_data_from_code = async function ( code, context ) {

	try {

		throw_on_failed_app_check( context )

		// Get code meta from API
		const { event, error, message } = await check_code_status( code )

		// Return only the event portion
		return { event, error: error && `${error}, ${message}` }


	} catch( e ) {
		console.error( 'get_event_data_from_code error: ', e )
		return { error: e.message }
	}

}

/* ///////////////////////////////
// Get code statusses
// /////////////////////////////*/
exports.get_code_statuses = async function ( codes, context ) {

	try {

		throw_on_failed_app_check( context )

		// Get code statuses from API
		const code_status_queue = codes.map( code => async () => {

			// Filter out superfluous data
			const { event, secret, event_template, ...code_data } = await call_poap_endpoint( `/actions/claim-qr`, { qr_hash: code }, 'GET' )

			// Track which issuers are using the app so I can give them POAPs


			return code_data
			
		} )
		const statuses = await throttle_and_retry( code_status_queue, 50, `get_code_status`, 2, 5 )
		return { statuses }


	} catch( e ) {
		console.error( 'get_code_statuses error: ', e )
		return { error: e.message }
	}

}