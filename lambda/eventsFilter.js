const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2'});
const uuid = require('uuid');

/*
    handler is the function that AWS Lambda invokes when triggered by API Gateway. handler runs in response to 
    every trigger, but code outside of handler (if any) runs only when the execution environment is created. 
*/
exports.handler = async (event, context, callback) => {
    //path to the resource, either '/events', '/events/eventsFilter', or '/ping'
    const resourcePath = event.context["resource-path"];
    
    const httpMethod = event.context['http-method'];
    
    //initialize variable to store db connection and search parameters
    var params;
    
    //this lambda handles several routes, so switch on resourcePath
    switch(resourcePath) {
        // GET request on '/events' should return all events
        case '/events':
            params = {
                TableName: 'ak-api-jonathan-dynamodb',
            };
            
            try {
                
                const items = await docClient.scan(params).promise();
                callback(null, items);
                break;
            } catch (error) {
                console.log("Error retrieving data from db");
                callback(error, null);
                break;
            }
        
        // GET request on '/events/eventsFilter' returns events meeting search criteria from query string parameters
        case '/events/eventsFilter':
            
            //define dictionary of acceptable parameters
            var acceptableParams = {
                'activity_type'     : true,
                'approver'          : true,
                'contact_email'     : true,
                'contact_name'      : true,
                'contact_phone'     : true,
                'cost'              : true,
                'created_timestamp' : true,
                'description'       : true,
                'disability_types'  : true,
                'end_date_time'     : true,
                'event_link'        : true,
                'event_status'      : true,
                'frequency'         : true,
                'location_address'  : true,
                'location_name'     : true,
                'max_age'           : true,
                'min_age'           : true,
                'org_name'          : true
            };
            
            var invalidParams = false; //this variable does nothing at the moment.
            
            //initialize variable to store invalid search parameter, if found
            var invalidParam = "";
            
            //object containing quert string parameters, attached to event object by API Gateway
            var qs = event.params.querystring;
            
            //initialize varible to store filterExpression string to pass to the db
            var filterExpression = "";
            
            //loop through query string parameters and check against dictionary of accpeptable parameters
            try {
                for(let key in qs) {
                    //if query string parameter is not in the dictionary, throw error
                    if(!acceptableParams[key]) {
                        invalidParams = true;
                        invalidParam = key;
                        throw new Error();
                    }
                    /*
                        filter expression is of the form, AttributeName = :AttributeValueKey
                        multiple paramters are joined with 'and'.
                    */
                    (filterExpression) ? filterExpression += `and :${key} = ${key} ` :  filterExpression += `:${key} = ${key} `;
                }
            } catch (error) {
                error.name = "Query error";
                error.message = `${invalidParam} is not a valid search parameter.`;
                console.log(`${invalidParam} is not a valid search parameter.`);
                callback(null, error);
                break;
            }
            
            console.log("You shouldn't see this message if there was an invalid search parameter");
            
            params = {
                TableName: 'ak-api-jonathan-dynamodb',
                /*
                    FilterExpression must be a string. Keys to AttributeValues are flagged with a colon.
                    ExpressionAttributeValues object defines those Keys and their values
                */
                FilterExpression: filterExpression,
                ExpressionAttributeValues: {
                    ':activity_type'     : qs.activity_type,
                    ':approver'          : qs.approver,
                    ':contact_email'     : qs.contact_email,
                    ':contact_name'      : qs.contact_name,
                    ':contact_phone'     : qs.contact_phone,
                    ':cost'              : qs.cost,
                    ':created_timestamp' : qs.created_timestamp,
                    ':description'       : qs.description,
                    ':disability_types'  : qs.disability_types,
                    ':end_date_time'     : qs.end_date_time,
                    ':event_link'        : qs.event_link,
                    ':event_status'      : qs.event_status,
                    ':frequency'         : qs.frequency,
                    ':location_address'  : qs.location_address,
                    ':location_name'     : qs.location_name,
                    ':max_age'           : qs.max_age,
                    ':min_age'           : qs.min_age,
                    ':org_name'          : qs.org_name
                },
            };
            
            try {
                const items = await docClient.scan(params).promise();
                callback(null, items);
                break;
            } catch (error) {
                console.log("Error retrieving data from db");
                callback(error, null);
                break;
            }
            
        //GET request on '/ping' returns affirmative message if the API is working    
        case '/ping':
            let pingMessage = {message: "Ping! It's working!"};
            callback(null, pingMessage);
            break;
        
        //switch statement should never reach this default. It is included for testing purposes
        default:
            console.error(`HTTP method requested (${httpMethod}) is invalid. Default case executed.`);

            let defaultMessage = {
                statusCode: 400,
                body: `¯\_(ツ)_/¯ - Don't know how you got here. API Gateway should have stopped you!`
            };
            callback(null, defaultMessage);
            break;
    }
};