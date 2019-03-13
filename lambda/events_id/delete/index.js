// aws-sdk is needed for its libraries that allow to access other aws services 
const AWS = require('aws-sdk');
// the DynamoDB.DocumentClient class allows access to Dynamodb directly 
// region must be us-west-2 for Oregon/Prod
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2'}); 
	
// this package is needed to validate parameters that are uuids
const validate = require('uuid-validate');

// lambda function that deletes an ak-api-travis-dynamodb (Events) db item by a given primary key
// it will need to handle PUT requests and GET in later sprints
exports.handler = async (event, context, callback) => {
    // log for when lambda function starts
    console.log("ak-api-travis-lambda lambda function started...");
    
    // this stores the input given by the caller, a UUID (uuid v1) for a specific item in the ak-api-travis-dynamodb table
    const ID = event.params.path['event_id'];
    
    // log for recording the given url parameter given
    console.log("Path parameter, event_id: ", ID);
    
	// this stores the http method used by the caller and is needed when determining whether the call is a 
	// DELETE, PUT, or GET request
    //const httpMethod = event.httpMethod;
    const httpMethod = event.context['http-method'];
    
    // status response needed for API Gateway to return the correct response
    const response = {
		statusCode: 200
	};
    
    
    // validate input parameter as uuid version 1, when fails a 400 response must be given
    if(!validate(ID, 4)) {
    	console.log("ERROR: uuid in not uuid/v4");
    	response.statusCode = 400;
		callback(JSON.stringify(response), null);
	
    }
    else {
	
	   // determine what http request is made to handle it appropriately 
	   // *** only using DELETE now but will need the others soon
	   if (httpMethod === 'DELETE') {
	   	
			// params contains the table name and primary key to delete an item with the given url parameter
		    var params = {
		        TableName : "ak-api-dynamo",
		        Key : {
					"event_id" : ID
				},
				// needed to return deleted item or empty object if nothing found to delete by given ID
		        "ReturnValues": "ALL_OLD"
			};
			
	
			try {
				// delete method is needed to delete items from a Dynamodb table
			    const data = await documentClient.delete(params).promise();
			    
			    // check if nothing was returned to cause a 404 response, item not found in db 
			    if(Object.entries(data).length === 0 && data.constructor === Object) {
			    	// log needed for when a parameter eventID is not found in the db
			    	console.log(`event_id ${ID} not found in Table.`);
			    	response.statusCode = 404;
			    	callback(JSON.stringify(response), null);
			    }
			    else {
			    	// log needed to confirm successful deletion of item in db
			    	console.log("Item successfully deleted.");
			    	// response.statusCode = 200; already set to 200
			    	callback(null, "Item Deleted");
			    }
				 
			} catch(err) {
				// error log needed to record internal server errors
				console.error("Internal Server Error: ", err);
				response.statusCode = 500;
				callback(JSON.stringify(response), null);
			}
			
	   }
	   
    }
 
   // log for when lambda function ends
    console.log("ak-api-travis-lambda lambda function ended.");
};



