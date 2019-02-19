console.log('Starting ActoKids Lambda function');
//CloudWatch log - This log tells us the Lambda function successfully triggered.

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2'});
const uuid = require('uuid');

//Variable needed to pass the timestamp for when the event is created in DynamoDB
var now = (new Date()).toJSON();

//CloudWatch log - timestamp to verify it is accurate. CloudWatch already stores timestamps - can compare.
console.log(`Lambda timestamp 'now' set as: ${now}`);

//CloudWatch log - required items and timestamp successfully created; beginning main part of the Lambda function
console.log("Required items loaded successfully. Beginning main portion of Lambda function.");

/*
    handler is the function that AWS Lambda invokes when triggered by API Gateway. handler runs in response to every trigger,
    but code outside of handler (if any) runs only when the execution environment is created.
*/
exports.handler = function(event, context, callback) {
    
    console.log("Entered handler function; checking switch cases.");
    
    let httpMethod = event.context['http-method'];
    
    //CloudWatch log - Log the event http method requested; can check correct switch statement entered
    console.log(`HTTP method requested: ${httpMethod}`);
    
    //Different operations needed depending on HTTP method called in API Gateway.
    //Switch statement is the most concise way to handle this.
    switch(httpMethod) {
        
        //GET request - currently implemented for a specific table item. It works, but needs refinement
        //as this endpoint it should be pulling the entire list of event objects
        case 'GET':
            
            //CloudWatch log - confirms http method request equal to switch case and the time it was requested.
            console.log(`GET case entered; ${httpMethod} was requested at ${now}.`);
            
            var params = {
                //TableName reference required for DynamoDB to know which table to get data from
                TableName: 'ak-api-test-dynamo',
                Key: {
                    "event_id": "ffc3e039-3766-4cb5-a046-a6f5f88a6ab8"
                }
            };
    
            //DynamoDB doc client .get requires params of what to search in Dynamo, and callback function
            //with what to return - error vs data
            docClient.get(params, function(error, data) {
                
                if(error) {
                    //CloudWatch log - an error occurred; log the error
                    console.error(`Error getting data from DynamoDB: ${error}`);
                    
                    callback(error, null);
                } else {
                    //CloudWatch log - check to see the data being returned is accurate
                    console.log(`GET data returned: ${data}`);
                    
                    callback(null, data);
                }
            });
            
            //CloudWatch log - GET request successfully executed; Log success message and exit switch
            console.log("GET case executed.");
            
            break;
        
        //POST request - currently implemented to pass API Gateway model object through to DynamoDB
        //Possible refinements required; especially when we begin to merge code from all team members
        case 'POST':
            
            //CloudWatch log - confirms http method request equal to switch case and the time it was requested.
            console.log(`POST case entered; ${httpMethod} was requested at ${now}`);
            
            //DynamoDB can't auto-increment a primary key; therefore we are using randomly generated UUIDs
            //The UUID only needs to be created if POST is called
            let nextId = uuid();
            
            //CloudWatch log - Verify the new UUID was created and log it
            console.log(`New event_id: ${nextId}`);
            
            /*
                Currently the event model in API gateway includes a uuid parameter. As this is the last 
                stop before entering DynamoDB we can't guarantee a valid UUID was set before this and
                therefore override the event_id currently held in the body of the POST request with the
                newly generated uuid. There may be a better solution, but this does work.
            */
            
            //CloudWatch log - verify the event_id is updated to the new uuid by logging before and after
            console.log(`Incoming event_id: ${event['body-json'].event_id}`);
            
            event['body-json'].event_id = nextId;
            
            console.log(`event_id updated: ${event['body-json'].event_id}`);
            
            /*
                Similar to the primary key issue I don't believe Dynamo can dynamically create a
                timestamp for a field in the table of when the item is added or updated. Therefore the
                created_timestamp in the body also needs to be overwritten in case it isn't passed.
                
                Note: If the API Gateway model is set to NOT require an event_id or created_timestamp
                we would still need to create and assign them here, but they may not need to override.
                Instead we would just need to add the fields to the body being passed to the handler function.
            */
            
            //CloudWatch log - verify the created_timestamp is updated to the new timestamp by logging before and after
            console.log(`Incoming created_timestamp: ${event['body-json'].created_timestamp}`);
            
            event['body-json'].created_timestamp = now;
            
            console.log(`created_timestamp updated: ${event['body-json'].created_timestamp}`);
            
            //DynamoDB needs to know which table to update and how the data is structured
            var params = {
                TableName: 'ak-api-test-dynamo',
                Item: event['body-json']
            };
            
            //DynamoDB doc client .put requires params of which table to use in Dynamo, and callback function
            //with what to return - error vs data. In .put's case data returned is {}. HTTP response set manually.
            docClient.put(params, function(error, data) {
                
                if(error) {
                    //CloudWatch log - an error occurred; log the error
                    console.error(`Error posting data to DynamoDB: ${error}`);
                    
                    callback(error, null);
                } else {
                    callback(null, data);
                }
            });
            
            //CloudWatch log - POST request successfully executed; Log success message and build response
            console.log("POST case executed.");
            
            
            //Only item required in the response is the new event_id; No need to return the whole object
            let response = {
                event_id: nextId
            };
            
            //CloudWatch log - verify response set before callback exits POST case.
            console.log(`Response: ${response.event_id}`);
            
            callback(null, response);
            break;
            
        default:
            /*
                No DELETE or PUT HTTP methods within this switch statement. 
                This Lambda function is only valid for the .../events endpoint; DELETE/PUT require
                an event_id and are valid on the endpoint .../events/{event_id}.
                
                Therefore any calls other than GET, POST, or OPTIONS (handled by API Gateway) are
                invalid and should end up here.
            */
            //CloudWatch log - Should not have ended up here; log the invalid request
            console.error(`HTTP method requested (${httpMethod}) is invalid. Default case executed.`);

            let defaultMessage = {
                statusCode: 400,
                body: `¯\_(ツ)_/¯ - Don't know how you got here. API Gateway should have stopped you!`
            };
            
            callback(null, defaultMessage);
            break;
    }
};