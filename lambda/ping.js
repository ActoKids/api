
/*
    handler is the function that AWS Lambda invokes when triggered by API Gateway. handler runs in response to 
    every trigger, but code outside of handler (if any) runs only when the execution environment is created. 
*/
exports.handler = async (event) => {
    console.log(`Logging ${event.key1}`)
    let date = new Date();
    //Content to be displayed to the user upon sucessfull call
    let bodyContent = {
        pingMessage : "API is working!",
        todaysDate : date,
    }
    //Set Access-Control-Allow-Origin to wildcard to ensure API can be invoked by client-side code
    const response = {
        statusCode: 200,
        headers : {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(bodyContent)
    };
    return response;
};
