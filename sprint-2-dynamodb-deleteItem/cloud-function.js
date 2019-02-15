const AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

// lambda function that deletes an Events db item by a given primary key 
exports.handler = function(event, context, callback){
    
    // this stores the input given by the caller, the parameter is
    // the ID primary key needed to delete the item in dynamodb
    const ID = event['params']['path'].eventID;
    // this stores the http method used by the caller, eventually this function will handle
    // DELTE, GET, and PUT
    const httpMethod = event.context['http-method'];
    
   
   // NOT COMPLETE: THIS ENDS UP IN BODY OF RESPONSE,
   // version from sprint 2 will fix and return response appropriately
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
   if (httpMethod === 'DELETE') {
      deleteEvent(ID, done);
   } else if (httpMethod === 'GET') {
      // not used yet
   } else if (httpMethod === 'PUT') {
      // not used yet
   }
   
};

// helper method to delete an item from the Events db
function deleteEvent(id, done) {
    // params contains the table name and primary key to delete an item given the id 
    var params = {
        // TableName: this is the name of the Table in Dynamodb
        TableName : "Events",
        // Key object: this is the primary key that was given as a parameter by the api call and
        // represents and event-id for an event
        Key : {
			"eventID" : id
		},
		"ConditionExpression": "attribute_not_exists(Replies)",
        "ReturnValues": "ALL_OLD"
	};
	// dynamoDB function that deletes item using params
	documentClient.delete(params, done);
	
}
