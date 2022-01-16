const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();

const deleteNote = async (params) => {
    const result = await dynamo.deleteItem(params).promise();
    return result;
};

exports.handler = async (event) => {
    let params = {
        Key: {
            'User': {
                S: event.note.User
            }, 
            'CreatedAt': {
                N: event.note.CreatedAt.toString()
            }
        },
        TableName: 'Notes'
    };

    const data = await deleteNote(params);

    const response = {
        statusCode: 200,
    };
    return response;
};