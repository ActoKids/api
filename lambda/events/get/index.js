/*
*  Zak Brinlee
*  AD 440 - ActoKids practicum
*  Sprint 5 task - Fix GET all events and prep for prod demo
*/

// aws-sdk is used for accessing aws services through libraries
const AWS = require('aws-sdk');

// Lambda function to handle GET requests for all Events in the ActoKids DynamoDB events table.
// handler object created by Lambda and serves as the entry point that AWS Lambda uses to execute your function code.
// event is the header and parameters from the request
exports.handler = async (event, context, callback) => {
  
   // Console log to CloudWatch for Lambda function start
   console.log("ActoKids GET all events function started.");
    
   // DynamoDB.DocumentClient is a helper class for accessing DynamoDB with Javascript
   const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2'});
  
   // responseBody variable to capture the response from DynamoDB for return message
   let responseBody = '';
  
   // statusCode variable to capture the statusCode as result of DynamoDB action (i.e. 404, 500 )
   let statusCode = 0;

   // Log calling API type and endpoint
   console.log("API endpoint called: " + event.context['http-method'] + " " + event.context['resource-path']);

   // Log calling API type and endpoint
   console.log("Calling from IP: " + event.params.header['X-Forwarded-For']);
  
   // parameters for DynamoDB request.
   // ProjectionExpression is for the request attributes of events in table
   const params = {
       TableName: 'ak-prod-events-dynamo',
       ProjectionExpression: "event_id, user_name, activity_type, description, org_name, location_name, location_address, contact_name, contact_phone, contact_email, start_date_time, end_date_time, frequency, cost, picture_url, min_age, max_age, disability_types, event_status, approver, created_timestamp, event_link, event_name"
   }//end of params

  
   try {
       // Creating variable {data} to store the response from DynamoDB using the params created above
       // documentClient.scan() Returns one or more items and item attributes by accessing every item in a table.
       const data = await documentClient.scan(params).promise();
      
       //setting responseBody and statusCode on successful return from DynamoDB
       responseBody = data;
       statusCode = 200;
      
       // Log for successful DynamoDB scan
       console.log("Successful scan. Status code: " + statusCode)

       callback(null, responseBody);
   } catch(err) {
       //setting responseBody and statusCode on successful return from DynamoDB
       responseBody = 'Unable to connect to database';
       statusCode = 500;
      
       // Log for error with DynamoDB scan
       console.error("Unsuccessful connection to DynamoDB. Status code: " + statusCode);
       console.error("Error: " + err);
  
       callback(JSON.stringify(err), null)
   }//end of catch

   // Create response to return with statusCode and responseBody.
   const response = {
       statusCode: statusCode,
       body: responseBody
   };
  
   // Console log to CloudWatch for Lambda response
   console.log("Response being returned by Lambda: ", response);
  
   // Console log to CloudWatch for Lambda function ending
   console.log("ActoKids GET all events function ended.");
  
}//end of exports.handler
