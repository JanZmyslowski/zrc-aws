//createOrUpdateNote
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const addOrUpdateNote = async (params) => {
    const result = await dynamo.put(params).promise();
    return result;
};

exports.handler = async (event) => {
    let params = {
        TableName: 'Notes',
        Item: event.note
    };

    const data = await addOrUpdateNote(params);

    const response = {
        statusCode: 200,
    };
    return response;
};