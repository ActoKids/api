// These are here for reference only

// for deleting a message
'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.deleteMessage = function(event, context, callback){
    var params = {
        TableName : "Messages",
		Key : {
			"Id" : event.id,
		}
		
	};
	console.log("Attempting a conditional delete...");
    documentClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
	
}


// for posting a new message
'use strict';

var AWS = require('aws-sdk'),
	uuid = require('uuid'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.postMessage = function(event, context, callback){
	var params = {
		Item : {
			"Id" : uuid.v1(),
			"Message" : event.name
		},
		TableName : process.env.TABLE_NAME
	};
	/*
	documentClient.put(params, function(err, data){
		callback(err, data);
		
	});
	*/
	documentClient.put(params, function(err, data) {
	    if (err) {
	        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	    } else {
	        console.log("Added item:", JSON.stringify(data, null, 2));
	    }
	});
	
}


// for getting all messages
'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.readAllMessages = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME
	};
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, data.Items);
		}
	});
}
