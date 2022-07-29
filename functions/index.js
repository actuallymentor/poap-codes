const functions = require("firebase-functions")

const { get_event_data_from_code, get_code_statuses } = require( './modules/codes' )
exports.get_event_data_from_code = functions.https.onCall( get_event_data_from_code )
exports.get_code_statuses = functions.https.onCall( get_code_statuses )