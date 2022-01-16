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