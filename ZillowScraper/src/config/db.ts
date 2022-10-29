import * as dotenv from "dotenv";
import { Client } from '@elastic/elasticsearch';
// import { createAWSConnection, awsGetCredentials } from '@acuris/aws-es-connection'
// import AWS from 'aws-sdk'

// const getESClient = async () => {
//     const esEndpoint = process.env.AWS_ES_ENDPOINT;
//     if (!esEndpoint) {
//         throw new Error(
//             'AWS_ES_ENDPOINT ENV not set.'
//         );
//     }

//     const awsCredentials = await awsGetCredentials();
//     const AWSConnection = createAWSConnection(awsCredentials);
//     const client = new Client({
//         ...AWSConnection,
//         node: esEndpoint,
//     });
//     return client;
// };

dotenv.config();
console.log(process.env.ELASTIC_ENDPOINT);



const client = new Client({
    node: process.env.ELASTIC_ENDPOINT,
    auth: {
        username: process.env.ELASTIC_USER || '',
        password: process.env.ELASTIC_PASSWORD || ''
    },
})



export { client };