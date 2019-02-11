
exports.handler = async (event) => {
    console.log(`Logging ${event.key1}`)
    let date = new Date();
    let bodyContent = {
        pingMessage : "API is working!",
        todaysDate : date,
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
