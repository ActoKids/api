/*
    Simple lambda function to support a ping API.  
    Returns context infomation about the Lambda context, along
    with a unique id, time stamp, and message to Erik
*/
const uuid = require('uuid');

exports.handler = async (event, context) => {
    let newId = uuid();
    let date = new Date();
    let bodyContent = {
        messageToErik : "Hello from Lambda! Courtesy of the AD440 
API team",
        todaysDate : date,
        newId,
        ...context
    }
    const response = {
        statusCode: 200,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(bodyContent)
    };
    return response;
};
