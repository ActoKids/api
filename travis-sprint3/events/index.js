// aws-sdk is needed for its libraries that allow to access other aws services 
const AWS = require('aws-sdk');
// the DynamoDB.DocumentClient class allows access to Dynamodb directly 
// region must be us-east-2 for Ohio
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2'}); 
	
// this package is needed to validate parameters that are uuids
const validate = require('uuid-validate');

// lambda function that deletes an ak-api-travis-dynamodb (Events) db item by a given primary key
// it will need to handle PUT requests and GET in later sprints
exports.handler = async (event, context) => {
    // log for when lambda function starts
    console.log("ak-api-travis-lambda lambda function started...");
    
    // this stores the input given by the caller, a UUID (uuid v1) for a specific item in the ak-api-travis-dynamodb table
    const ID = event.pathParameters.eventID;
    
    // log for recording the given url parameter given
    console.log("Path parameter, eventID: ", ID);
    
	// this stores the http method used by the caller and is needed when determining whether the call is a 
	// DELETE, PUT, or GET request
    const httpMethod = event.httpMethod;
    
    // validate input parameter as uuid version 1, when fails a 400 response must be given
    if(!validate(ID, 1)) {
    	var response = {
		    statusCode: 400,
		    headers: {
		        "Access-Control-Allow-Origin": "*"
		    },
		 }
		 return response;
    }


   // determine what http request is made to handle it appropriately 
   // *** only using DELETE now but will need the others soon
   if (httpMethod === 'DELETE') {
   	
		// params contains the table name and primary key to delete an item with the given url parameter
	    var params = {
	        TableName : "ak-api-travis-dynamodb",
	        Key : {
				"eventID" : ID
			},
			// needed to return deleted item or empty object if nothing found to delete by given ID
	        "ReturnValues": "ALL_OLD"
		};
		
		let code;
		try {
			// delete method is needed to delete items from a Dynamodb table
		    const data = await documentClient.delete(params).promise();
		    
		    // check if nothing was returned to cause a 404 response, item not found in db 
		    if(Object.entries(data).length === 0 && data.constructor === Object) {
		    	code = 404;
		    	// log needed for when a parameter eventID is not found in the db
		    	console.log(`eventID ${ID} not found in Table.`);
		    }
		    else {
		    	code = 200;
		    	// log needed to confirm successful deletion of item in db
		    	console.log("Item successfully deleted.");
		    }
			 
		} catch(err) {
			code = 500;
			// error log needed to record internal server errors
			console.error("Internal Server Error: ", err);
		}
		
		// if you want a mesage for humans add body after headers
		var response = {
			statusCode: code,
			headers: {
			    "Access-Control-Allow-Origin": "*"
			},
	    }
		
		
	    return response;
		
   } else if (httpMethod === 'GET') {
      // not used in this sprint
   } else if (httpMethod === 'PUT') {
      // not used in this sprint
   }
 
   // log for when lambda function ends
    console.log("ak-api-travis-lambda lambda function ended.");
};


