'use strict'
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

AWS.config.update({ region: 'us-west-2'});

exports.handler = async (event, context) => {
    
    //insantiate new instance of DynamoDB object
    const db = new AWS.DynamoDB({ apiVersion: '2012-10-08'});
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});

    // variable for unique key
    var id = uuidv1();
    
    let responseBody = '';
    let statusCode = 0;
    
    const params = {
        TableName: 'test_table',
        Item: {
            id: 'Test-' + id.split('-', 1),
            createdAt: new Date().toString()
        } 
    }//end of params
    
    try {
        const data = await documentClient.put(params).promise();
        statusCode = 200;
        responseBody = 'Successful put';
    } catch(err) {
        responseBody = 'Unable to get user data';
        statusCode = 403;
        console.log(err);
    }//end of catch
    
    //response structure for return
    const response = {
        statusCode: statusCode, 
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: responseBody
    }//end of response
    
    return response;
}//end of exports.handler
