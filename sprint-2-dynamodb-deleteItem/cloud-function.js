// THIS IS ONLY FOR VIEWING, THE ACTUAL FUNCTION IS IN MY AWS ACCOUNT

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

// lambda function that deletes an Events db item by a given primary key and sort key
exports.handler = function(event, context, callback){
    
   // gets json body for access to parameters 
   let body = event['body-json'];
   
   // NOT COMPLETE: THIS ENDS UP IN BODY OF RESPONSE
   // handles error message 
   const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? ("Error " + err.message) : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
   // determine what http request is made to handle it appropriately 
   // only using DELETE now but will need the others soon
   if (event.context['http-method'] === 'DELETE') {
      //console.log(event.context['http-method'] + " here");
      deleteEvent(body, done);
   } else if (event.context['http-method'] === 'GET') {
      // 
   } else if (event.context['http-method'] === 'PUT') {
      //
      
   }
   
   return { event, body };
};

// helper method to delete an item from the Events db
function deleteEvent(body, done) {
    // params contains the table name and primary key to delete an item given the id 
    var params = {
        TableName : "Events",
        Key : {
			"id" : body.id,
			"approved": body.approved
		},
		"ConditionExpression": "attribute_not_exists(Replies)",
        "ReturnValues": "ALL_OLD"
	};
	
	documentClient.delete(params, done);
	
}
