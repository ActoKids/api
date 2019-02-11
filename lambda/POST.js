console.log('Loading function');
//CloudWatch log - function successfully triggered notice

//Load required items and create DynamoDB doc client
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});
const uuid = require('uuid');

var now = (new Date()).toJSON();

//create handler function
exports.handler = function(event, context, callback) {
    
    //switch statement to determine which HTTP method has been requested
    switch(event.context['http-method']) {
        //DELETE request - not implemented and wouldn't be for this endpoint anyway - will be removed
        case 'DELETE':
            break;
        
        //GET request - currently implemented for a specific table item. It works, but needs refinement
        //For this endpoint it should be pulling the entire list of event objects    
        case 'GET':
            console.log("GET requested");
            //set params to pass to the .get method of the doc client
            var params = {
                //table name in DynamoDB to get data from
                TableName: 'Sprint3_POST_updates',
                //key(s) for which event to retrieve
                Key: {
                    "event_id": "5c700410-2eb4-4460-b0cd-25779af4d89d"
                }
            }
            
            //doc client .get method. Passed params and callback function
            docClient.get(params, function(error, data) {
                if(error) {
                    //if there is an error, pass the error back
                    callback(error, null);
                } else {
                    //else pass the data back
                    callback(null, data);
                }
            });
            
            break;
            
        //PUT request - not implemented and wouldn't be for this endpoint anyway - will be removed
        case 'PUT':
            break;
        
        //POST request - currently implemented to pass API Gateway model object through to DynamoDB
        //Could probably use some refinement
        case 'POST':
            console.log("POST requested");
            //set variable for new uuid to be used as the event_id
            var nextId = uuid();
            console.log(`Setting new event ID: ${nextId}`);
            //set event_id to the new uuid
            event['body-json'].event_id = nextId;
            console.log(`Setting DB creation timestamp: ${now}`);
            //set the created_timestamp to current time
            event['body-json'].created_timestamp = now;
            
            //set params to pass to the .put method of the doc client
            var params = {
                //table name in DynamoDB to put data to
                TableName: 'Sprint3_POST_updates',
                //set the item to the JSON object passed through the API Gateway
                Item: event['body-json']
            };
            
            //doc client .put method. Passed params and callback function
            docClient.put(params, function(error, data) {
                if(error) {
                    //if there is an error, pass the error back
                    callback(error, null);
                } else {
                    //else pass the data back to the .put and add a new item in DynamoDB
                    callback(null, data);
                }
            });
            
            //define response object
            var response = {
                event_id: nextId
            };
            
            //send event_id back to client
            callback(null, response);

            break;
        
        //default for switch cases; currently not implemented
        default:
            break;
    }
}