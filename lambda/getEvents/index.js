'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2'});

exports.handler = async (event, context) => {
    
    //insantiate new instance of DynamoDB object
    const db = new AWS.DynamoDB({ apiVersion: '2012-10-08'});
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});

    // Variables for response and status code based on Scan
    let responseBody = '';
    let statusCode = 0;
    
    const params = {
        TableName: 'sprint2_testTable',
        ProjectionExpression: "id, user_name, activity_type, description, organization_name, location_name, location_address, contact_name, contact_phone, contact_email, start_date_time, end_date_time, frequency, cost, picture_url, min_age, max_age, disability_types, show_status, approver"
    }//end of params

    
    try {
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 200;
    } catch(err) {
        responseBody = 'Unable to connect to database';
        statusCode = 500;
        console.log(err);
    }//end of catch

    const response = {
        statusCode: statusCode,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body: responseBody
    };
    
    return response;
}//end of exports.handler