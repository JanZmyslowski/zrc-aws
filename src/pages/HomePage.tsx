
function HomePage() {
    return (
        <div>Home</div>
    );
}

export default HomePage;

// import config from './config';

// const user = await Auth.signIn('admin3', 'adminpass2');

//             const lambda = new Lambda(
//                 {
//                     region: config.region,
//                     accessKeyId: config.accessKeyId,
//                     secretAccessKey: config.secretAccessKey,
//                     sessionToken: config.sessionToken
//                 });

//             lambda.invoke({
//                 FunctionName: 'cognitoTest',
//                 Payload: JSON.stringify({ user: await Auth.currentAuthenticatedUser() }),
//             }, function (err, data) {
//                 if (err) console.log(err, err.stack); // an error occurred
//                 else console.log(data);           // successful response
//             });

//             lambda.listFunctions({
//                 FunctionVersion: 'ALL'
//             }, function (err, data) {
//                 if (err) console.log(err, err.stack); // an error occurred
//                 else console.log(data);           // successful response
//             });