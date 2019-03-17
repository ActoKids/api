
/*
*  Zak Brinlee
*  AD 440 - ActoKids practicum
*  Sprint 5 task - Fix GET by event_id and prep for prod demo
*/

// aws-sdk is used for accessing aws services through libraries 
const AWS = require('aws-sdk');

// Lambda function to handle GET requests for specific Events in the ActoKids DynamoDB events table by the event_id key.

// this package is needed to validate parameters that are uuids
const isUUID = require('is-uuid');

// handler object created by Lambda and serves as the entry point that AWS Lambda uses to execute your function code. 
// event is the header and parameters from the request
exports.handler = async (event, context, callback) => {
    
    // Console log to CloudWatch for Lambda function start
    console.log("ActoKids GET event by event_id function started.");
    
    // Insantiate new instance of DynamoDB object with specified api version. 
    const db = new AWS.DynamoDB({ apiVersion: '2012-10-08'});
    
    // DynamoDB.DocumentClient is a helper class for accessing DynamoDB with Javascript
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});

    // body variable to capture the response from DynamoDB for return message
    let body = 'Unknown Error - Invalid ID';
    
    // statusCode variable to capture the statusCode as result of DynamoDB action (i.e. 404, 500 )
    let statusCode = 0;

    // eventId variable to capture the specific event id coming from the path parameters in the http request
    const eventId = event.params.path['event_id'];
    
    // Console log to CloudWatch for the event id provided in the path parameters.
    console.log("Path parameter, event_id: ", eventId);

    // this stores the http method used by the caller
    //const httpMethod = event.httpMethod;
    const httpMethod = event.context['http-method'];
    
    //Log calling API type and endpoint
    console.log("API-Endpoint called: " + httpMethod + " " + event.context['resource-path']);
    
    //Log calling IP
    console.log("Calling-IP: " + event.params.header['X-Forwarded-For']);

    // Create response to return with statusCode, headers, and responseBody. 
    const response = {
        statusCode: statusCode,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body: body
    };
    
    // validate input parameter as uuid version 5, when fails a 400 response must be given
    if(!isUUID.anyNonNil(eventId)) {
    	console.log("ERROR: uuid in not uuid/v4");
    	response.statusCode = 400;
		callback(JSON.stringify(response), null);
	
    }
    else {

        // parameters for DynamoDB request. 
        const params = {
            TableName: 'ak-prod-events-dynamo',
            KeyConditionExpression: "#event_id = :event_id",
            // Specify which attribute to search for
            ExpressionAttributeNames:{
                "#event_id": "event_id"
            },
            // Specify which attribute value {event id} to search for
            ExpressionAttributeValues: {
                ":event_id": eventId
            },
            // ProjectionExpression is for the request attributes of events in table 
            ProjectionExpression: "event_id, user_name, activity_type, description, organization_name, location_name, location_address, contact_name, contact_phone, contact_email, start_date_time, end_date_time, frequency, cost, picture_url, min_age, max_age, disability_types, show_status, approver"
        }//end of params
    
        try {
            // Creating variable {data} to store the response from DynamoDB using the params created above
            // documentClient.query() will search the entire table based on the parameters given.
            const data = await documentClient.query(params).promise();
            response.body = data;
            console.log(JSON.stringify(response));
            // Checking if the query returned with an event or found no matches
            if(response.body.Count == 0) {
                //setting responseBody and statusCode on no results returned from DynamoDB
                response.Body = 'Event not found';
                response.statusCode = 404;
            
                callback(response, null)
                // Log for no event found
                console.log("Query did not find a matching event with the event_id provided. Status code: ", statusCode);
            } else {
                //setting responseBody and statusCode on successful return of event from DynamoDB
                response.body = response.body.Items;
                response.statusCode = 200;
                
                callback(null, response.body)
                // Log for event found
                console.log("Event found, status code: ", statusCode);
            }
            
        } catch(err) {
            response.body = 'Failure to connect or retrieve from the database';
            response.statusCode = 500;
            
            // Log for error with DynamoDB query
            console.error("Unsuccessful connection to DynamoDB. Status code: " + statusCode);
            console.error("Error: " + err);
            callback(JSON.stringify(response), null)
        }//end of catch
    }


    // Console log to CloudWatch for response returned by Lambda function
    console.log("Response being returned by Lambda: ", response);

    // Console log to CloudWatch for Lambda function ending
    console.log("ActoKids GET event by event_id function ended.");
    
}//end of exports.handler
