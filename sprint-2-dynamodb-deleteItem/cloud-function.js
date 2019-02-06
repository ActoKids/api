const AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

// lambda function that deletes an Events db item by a given primary key
exports.handler = function(event, context, callback){
    
    // this stores the input given by the caller
    const ID = event['params']['path'].eventID;
    // this stores the http method used by the caller
    const httpMethod = event.context['http-method'];
    
    //console.log(event);
    //console.log("input id: " + ID);
    //console.log("http-method: " + event.context['http-method']);
    
   
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
   if (httpMethod === 'DELETE') {
      //console.log(event.context['http-method'] + " here");
      deleteEvent(ID, done);
   } else if (httpMethod === 'GET') {
      // 
   } else if (httpMethod === 'PUT') {
      //
   }
   
   return { event, ID};
};

// helper method to delete an item from the Events db
function deleteEvent(id, done) {
    // params contains the table name and primary key to delete an item given the id 
    var params = {
        TableName : "Events",
        Key : {
			"eventID" : id
		},
		"ConditionExpression": "attribute_not_exists(Replies)",
        "ReturnValues": "ALL_OLD"
	};
	
	documentClient.delete(params, done);
	
}
