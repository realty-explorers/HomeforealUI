import NextAuth, { Session } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
    // Configure one or more authentication providers
    // session: {
    //     strategy: "jwt",
    // },
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET,
            issuer: process.env.COGNITO_ISSUER,
        }),
        // CredentialsProvider({
        //     name: 'Credentials',

        //     credentials: {
        //         username: { label: "Username", type: "text", placeholder: "jsmith" },
        //         password: { label: "Password", type: "password" }
        //     },
        //     async authorize(credentials, req) {
        //         console.debug("****createCredential: ", JSON.stringify(credentials))
        //                         var aws = require('aws-sdk');
        //         aws.config.update({
        //             region: 'us-east-1',
        //             credentials: new aws.CognitoIdentityCredentials({
        //                 IdentityPoolId: '???'
        //             })
        //         });

        //         var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        //         const UserPoolId = process.env.SOMEPOOLID
        //         const userParams = {
        //             "AuthParameters": {
        //                 "USERNAME": credentials.username,
        //                 "PASSWORD": credentials.password,
        //             },
        //             "AuthFlow": "ADMIN_NO_SRP_AUTH",
        //             "ClientId": process.env.SOMECLIENTID,
        //             UserPoolId
        //         };
        //         const errorInit = await cognitoidentityserviceprovider
        //             .adminInitiateAuth(userParams).promise()
        //             .then((data) => {
        //                 return null
        //             })
        //             .catch((error) => {
        //                 console.error("*****error createCredential adminInitiateAuth: ", error)
        //                 console.error(JSON.stringify(error))
        //                 return error
        //             })
        //         if (errorInit) {
        //             console.error("*****errorInit: ", errorInit)
        //             if (errorInit.code) {
        //                 return Promise.reject(new Error(
        //                     errorInit.code
        //                 ))
        //             }
        //             return Promise.reject(new Error(
        //                 "Unknown Error"
        //             ))
        //         }
        //     }
        // })
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.accessToken = token.accessToken
            session.user.id = token.id
            const email = session.user.email as string;
            session.user.name = email.substring(0, email.indexOf('@'));

            return session
        },
        pages: {
            signIn: '/auth/signIn',
            error: '/auth/signIn'
        }

    },
}

export default NextAuth(authOptions)