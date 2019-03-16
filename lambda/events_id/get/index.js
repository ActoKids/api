
/*
*  Zak Brinlee
*  AD 440 - ActoKids practicum
*  Sprint 3 task - Logging relevant data from GET event by id function
*  This Lambda function is currently on my personal AWS account
*/

// aws-sdk is used for accessing aws services through libraries 
const AWS = require('aws-sdk');

// Lambda function to handle GET requests for specific Events in the ActoKids DynamoDB events table by the event_id key.
// This function will need to have the handling for PUT and DELETE requests during later sprints

// handler object created by Lambda and serves as the entry point that AWS Lambda uses to execute your function code. 
// event is the header and parameters from the request
exports.handler = async (event, context) => {
    
    // Console log to CloudWatch for Lambda function start
    console.log("ak-api-zak-lambda GET event by event_id function started.");
    
    // Insantiate new instance of DynamoDB object with specified api version. 
    const db = new AWS.DynamoDB({ apiVersion: '2012-10-08'});
    
    // DynamoDB.DocumentClient is a helper class for accessing DynamoDB with Javascript
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});

    // responseBody variable to capture the response from DynamoDB for return message
    let responseBody = '';
    
    // statusCode variable to capture the statusCode as result of DynamoDB action (i.e. 404, 500 )
    let statusCode = 0;
    
    // eventId variable to capture the specific event id coming from the path parameters in the http request
    let eventId = event.pathParameters.id;
    
    // Console log to CloudWatch for the event id provided in the path parameters.
    console.log("Path parameter, event_id: ", eventId);
   
    // parameters for DynamoDB request. 
    const params = {
        TableName: 'sprint2_testTable',
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
        responseBody = data;

        // Checking if the query returned with an event or found no matches
        if(responseBody.Count == 0) {
            //setting responseBody and statusCode on no results returned from DynamoDB
            responseBody = 'Event not found';
            statusCode = 404;
            
            // Log for no event found
            console.log("Query did not find a matching event with the event_id provided. Status code: ", statusCode);
        } else {
            //setting responseBody and statusCode on successful return of event from DynamoDB
            responseBody = JSON.stringify(responseBody.Items);
            statusCode = 200;
            
            // Log for event found
            console.log("Event found, status code: ", statusCode);
        }
        
    } catch(err) {
        responseBody = 'Failure to connect or retrieve from the database';
        statusCode = 500;
        
        // Log for error with DynamoDB query
        console.error("Unsuccessful connection to DynamoDB. Status code: " + statusCode);
        console.error("Error: " + err);
    }//end of catch

    // Create response to return with statusCode, headers, and responseBody. 
    const response = {
        statusCode: statusCode,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body: responseBody
    };

    // Console log to CloudWatch for response returned by Lambda function
    console.log("Response being returned by Lambda: ", response);

    // Console log to CloudWatch for Lambda function ending
    console.log("ak-api-zak-lambda lambda GET event by event_id function ended.");
    
    return response;
}//end of exports.handler
