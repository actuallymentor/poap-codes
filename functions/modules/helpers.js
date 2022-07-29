// ///////////////////////////////
// Development helpers
// ///////////////////////////////
const dev = process.env.NODE_ENV === 'development'
const log = ( ...messages ) => {
	if( dev ) console.log( ...messages )
}
const wait = ( time, error=false ) => new Promise( ( res, rej ) => setTimeout( error ? rej : res, time ) )

/* ///////////////////////////////
// Retryable & throttled async
// /////////////////////////////*/
const Throttle = require( 'promise-parallel-throttle' )
const Retrier = require( 'promise-retry' )

/**
* Make async function (promise) retryable
* @param { function } async_function The function to make retryable
* @param { string } logging_label The label to add to the log entries
* @param { number } retry_times The amount of times to retry before throwing
* @param { number } cooldown_in_s The amount of seconds to wait between retries
* @param { boolean } cooldown_entropy Whether to add entropy to the retry delay to prevent retries from clustering in time
* @returns { function } An async function (promise) that will retry retry_times before throwing
*/
function make_retryable( async_function, logging_label='unlabeled retry', retry_times=5, cooldown_in_s=10, cooldown_entropy=true ) {

	// Formulate retry logic
	const retryable_function = () => Retrier( ( do_retry, retry_counter ) => {

		// Failure handling
		return async_function().catch( async e => {

			// If retry attempts exhausted, throw out
			if( retry_counter >= retry_times ) {
				log( `♻️🚨 ${ logging_label } retry failed after ${ retry_counter } attempts` )
				throw e
			}

			// If retries left, retry with a progressive delay
			const entropy = !cooldown_entropy ? 0 : ( .1 + Math.random() )
			const cooldown_in_ms = ( cooldown_in_s + entropy ) * 1000
			const cooldown = cooldown_in_ms + ( cooldown_in_ms * ( retry_counter - 1 ) )
			log( `♻️ ${ logging_label } retry failed ${ retry_counter }x, waiting for ${ cooldown / 1000 }s` )
			await wait( cooldown )
			log( `♻️ ${ logging_label } cooldown complete, continuing...` )
			return do_retry()

		} )

	} )

	return retryable_function

}

/**
* Make async function (promise) retryable
* @param { array } async_function_array Array of async functions (promises) to run in throttled parallel
* @param { number } max_parallell The maximum amount of functions allowed to run at the same time
* @param { string } logging_label The label to add to the log entries
* @param { number } retry_times The amount of times to retry before throwing
* @param { number } cooldown_in_s The amount of seconds to wait between retries
* @returns { Promise } An async function (promise) that will retry retry_times before throwing
*/
async function throttle_and_retry( async_function_array=[], max_parallell=2, logging_label, retry_times, cooldown_in_s ) {

	// Create array of retryable functions
	const retryable_async_functions = async_function_array.map( async_function => {
		const retryable_function = make_retryable( async_function, logging_label, retry_times, cooldown_in_s )
		return retryable_function
	} )

	// Throttle configuration
	const throttle_config = {
		maxInProgress: max_parallell	
	}

	// Return throttler
	return Throttle.all( retryable_async_functions, throttle_config )

}

module.exports = {
	dev,
	wait,
	throttle_and_retry,
	log
}