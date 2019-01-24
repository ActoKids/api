'use strict';
// this cloud function writes (POST) a new message to dynamodb
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
	documentClient.put(params, function(err, data){
		callback(err, data);
		
	});
	
}
