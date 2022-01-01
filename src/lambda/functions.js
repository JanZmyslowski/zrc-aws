/*
//getNotes
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const getNotes = async (params) => {
    const scanResult = await (params.KeyConditionExpression ? await dynamo.query(params).promise() : await dynamo.scan(params).promise());

    return scanResult;
};

exports.handler = async (event) => {
    let params = {
        TableName: 'Notes',
    };

    if (event.user) {
        params.KeyConditionExpression = '#us = :user';
        params.ExpressionAttributeNames = {};
        params.ExpressionAttributeValues = {};
        params.ExpressionAttributeNames['#us'] = 'User';
        params.ExpressionAttributeValues[':user'] = event.user;
    }

    if (!event.endDate) {
        event.endDate = new Date().getTime();
    }
    if (!event.startDate) {
        event.startDate = new Date('1900-01-16').getTime();
    }

    if (event.startDate && event.endDate) {
        if (!params.ExpressionAttributeNames) {
            params.FilterExpression = '#yr between :start_yr and :end_yr';
            params.ExpressionAttributeNames = {};
            params.ExpressionAttributeValues = {};
        } else {
            params.KeyConditionExpression += ' and #yr between :start_yr and :end_yr';
        }
        params.ExpressionAttributeNames['#yr'] = 'CreatedAt';
        params.ExpressionAttributeValues[':start_yr'] = event.startDate;
        params.ExpressionAttributeValues[':end_yr'] = event.endDate;
    }
    const data = await getNotes(params);

    const response = {
        statusCode: 200,
        body: data,
    };
    return response;
};

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


//deleteNote
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();

const deleteNote = async (params) => {
    const result = await dynamo.deleteItem(params).promise();

    return result;
};

exports.handler = async (event) => {
    let params = {
        Key: {
           "User": {
             S: event.note.User
            }, 
           "CreatedAt": {
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

//translateNote
const AWS = require('aws-sdk');
const translator = new AWS.Translate();

const translateNote = async (params) => {
    const result = await translator.translateText(params).promise();

    return result;
};



exports.handler = async (event) => {
    let params = {
        SourceLanguageCode: event.sourceLang ?? 'auto',
        TargetLanguageCode: event.targetLang,
        Text: event.note
        
    };
    
    const result = await translateNote(params);
    
    const response = {
        statusCode: 200,
        body: result
    };
    return response;
};
*/
