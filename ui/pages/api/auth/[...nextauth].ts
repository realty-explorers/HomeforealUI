import NextAuth, { Session } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: process.env.NEXT_AUTH_COGNITO_USER_POOL_ID,
    ClientId: process.env.NEXT_AUTH_COGNITO_CLIENT_ID,
};
// const userPool = new CognitoUserPool(poolData);

export const authOptions = {
    session: {
        maxAge: 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET,
            issuer: process.env.COGNITO_ISSUER,
        }),
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_DOMAIN
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
    // callbacks: {
    //     async jwt({ token, user, account, profile, isNewUser }) {
    //         // console.log("****jwt: ", JSON.stringify(token))
    //         if (account?.access_token) {
    //             token.accessToken = account.access_token;
    //             token.idToken = account.id_token;
    //         }
    //         return token;
    //     },
    //     async session({ session, token, user }) {
    //         if (token.accessToken) {
    //             session.accessToken = token.accessToken;
    //             session.idToken = token.idToken;
    //             session.user.email = token.email;
    //             session.user.id = token.sub;
    //             session.user.name = token.email.substring(0, token.email.indexOf('@'));
    //             console.log(session.user.name)
    //         }
    //         return session
    //     }

    // },
}

export default NextAuth(authOptions)