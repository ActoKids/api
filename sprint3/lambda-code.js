// THIS FILE IS ONLY FOR VIEWING CODE STORED IN AWS

const AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'}); 
	
AWS.config.update({ region: 'us-west-2'});

// lambda function that deletes an Events db item by a given primary key
exports.handler = async (event, context) => {
    
    // this stores the input given by the caller
    const ID = event.pathParameters.eventID;
    // this stores the http method used by the caller
    const httpMethod = event.httpMethod;


   // determine what http request is made to handle it appropriately 
   // only using DELETE now but will need the others soon
   if (httpMethod === 'DELETE') {
   	
		// params contains the table name and primary key to delete an item given the id 
	    var params = {
	        TableName : "Events",
	        Key : {
				"eventID" : ID
			},
			"ConditionExpression": "attribute_not_exists(Replies)",
	        "ReturnValues": "ALL_OLD"
		};
		
		// delete item
	    const data = await documentClient.delete(params).promise();
	    console.log("DATA: ", data);
	    let code;
	    // check if nothing was returned to cause a 404 response, item not found in db
	    if(Object.entries(data).length === 0) {
	    	code = 404;
	    }
	    else {
	    	code = 200;
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
      // not used yet
   } else if (httpMethod === 'PUT') {
      // not used yet
   }
 
   
};

