console.log('Starting ActoKids PUT function');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});
const isUUID = require('is-uuid');
/*
    handler is the function that AWS Lambda invokes when triggered by API Gateway. handler runs in response to
    every trigger, but code outside of handler (if any) runs only when the execution environment is created.
*/

exports.handler = async (event, context, callback) => {
	console.log("Entered handler function");

	let httpMethod = event.context['http-method'];

	// body variable to capture the response from DynamoDB for return message
	let body = 'Unknown Error - Invalid ID';

	// statusCode variable to capture the statusCode as result of DynamoDB action (i.e. 404, 500 )
	let statusCode = 0;

	//Log calling API type and endpoint
	console.log("API-Endpoint called: " + httpMethod + " " + event.context['resource-path']);

	//Log calling IP
	console.log("Calling-IP: " + event.params.header['X-Forwarded-For']);


	const ID               = event.params.path['event_id'];
	const activity_type    = event['body-json'].activity_type;
	const approver         = event['body-json'].approver;
	const contact_email    = event['body-json'].contact_email;
	const contact_name     = event['body-json'].contact_name;
	const contact_phone    = event['body-json'].contact_phone;
	const cost             = event['body-json'].cost;
	const description      = event['body-json'].description;
	const disability_types = event['body-json'].disability_types;
	const end_date_time    = event['body-json'].end_date_time;
	const event_link       = event['body-json'].event_link;
	const event_name       = event['body-json'].event_name;
	const event_status     = event['body-json'].event_status;
	const frequency        = event['body-json'].frequency;
	const location_address = event['body-json'].location_address;
	const location_name    = event['body-json'].location_name;
	const max_age          = event['body-json'].max_age;
	const min_age          = event['body-json'].min_age;
	const org_name         = event['body-json'].org_name;
	const start_date_time  = event['body-json'].start_date_time;
	const picture_url      = event['body-json'].picture_url;
	const inclusive_event  = event['body-json'].inclusive_event;

	const response = {
		statusCode: statusCode,
		body: body
	};

	// validate input parameter as uuid version 4, when fails a 400 response must be given
	if (!isUUID.anyNonNil(ID)) {
		console.log("ERROR: uuid is not uuid/v4");
		response.statusCode = 400;
		callback(JSON.stringify(response), null);
	} else {
		// parameters required for a successful upload attempt
		var params = {
			TableName: 'ak-prod-events-dynamo',
			Key : {
			"event_id" : ID,
			},
			ConditionExpression: 'attribute_exists(event_id)',
			// Lambda requires each attribute to be on one line. I know it looks bad.
			UpdateExpression: "set activity_type = :activity_type, approver = :approver, contact_email = :contact_email, contact_name = :contact_name, contact_phone = :contact_phone, cost = :cost, description = :description,  disability_types = :disability_types, end_date_time = :end_date_time,  event_link = :event_link, event_name = :event_name,  event_status = :event_status, frequency = :frequency,  location_address = :location_address, location_name = :location_name, max_age = :max_age, min_age = :min_age, org_name = :org_name, start_date_time = :start_date_time, picture_url = :picture_url, inclusive_event = :inclusive_event",
			ExpressionAttributeValues: {
				":activity_type":activity_type,
				":approver":approver,
				":contact_email":contact_email,
				":contact_name":contact_name,
				":contact_phone":contact_phone,
				":cost":cost,
				":description":description,
				":disability_types":disability_types,
				":end_date_time":end_date_time,
				":event_link":event_link,
				":event_name":event_name,
				":event_status":event_status,
				":frequency":frequency,
				":location_address":location_address,
				":location_name":location_name,
				":max_age":max_age,
				":min_age":min_age,
				":org_name":org_name,
				":start_date_time":start_date_time,
				":picture_url":picture_url,
				":inclusive_event":inclusive_event
				},
				ReturnValues:"UPDATED_NEW"
				};
		try {			
			const data = await docClient.update(params).promise();
			response.body = "Item successfully updated.";
			callback(null, response.body);
			console.log("Event found, status code: ", response.statusCode);
		} catch (err) {
			err.body = 'Failure to connect or retrive from the database';
			err.statusCode = 500;

			// Log for error with DynamoDB query
			console.error("Unsuccessful connection to DynamoDB. Status code: " + response.statusCode);
			console.error("Error: " + err);
			callback(JSON.stringify(err), null);
		}	
	}
};
