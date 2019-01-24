'use strict'
const AWS = require('aws-sdk');

//set region for AWS
AWS.config.update({ region: 'us-west-2'});

exports.handler = async (event, context) => {
    
    //insantiate new instance of DynamoDB object
    const db = new AWS.DynamoDB({ apiVersion: '2012-10-08'});
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});

    let responseBody = '';
    let statusCode = 0;
    
    const params = {
        TableName: 'test_table',
        ProjectionExpression: "id, createdAt"
    }//end of params

    try {
        const data = await documentClient.scan(params).promise();
        responseBody = data
        statusCode = 200;
    } catch(err) {
        responseBody = 'Unable to get user data';
        statusCode = 403;
        console.log(err);
    }//end of catch

    //response structure for return
    const response = {
        statusCode: statusCode,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody.Items)
    };
    
    return response;
}//end of exports.handler