import cors from 'cors';
import express from 'express';
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";


let { Google, Github, Apple } = ThirdPartyEmailPassword;

const initSupertokens = () => {

	supertokens.init({
		framework: "express",
		supertokens: {
			// https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
			connectionURI: "https://try.supertokens.com",
			// connectionURI: "http://localhost:3567",
			// apiKey: <API_KEY(if configured)>,
		},
		appInfo: {
			appName: "homeforeal",
			apiDomain: "http://localhost:9000",
			websiteDomain: process.env.HOST!,
			apiBasePath: "/api/auth",
			websiteBasePath: "/auth"
		},
		recipeList: [
			ThirdPartyEmailPassword.init({
				providers: [
					// We have provided you with development keys which you can use for testing.
					// IMPORTANT: Please replace them with your own OAuth keys for production use.
					Google({
						clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
						clientSecret: "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"
					}),
					Github({
						clientId: "467101b197249757c71f",
						clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
					}),
					Apple({
						clientId: "4398792-io.supertokens.example.service",
						clientSecret: {
							keyId: "7M48Y4RYDL",
							privateKey:
								"-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
							teamId: "YWQCXGJRJL",
						},
					}),
					// Facebook({
					//     clientSecret: "FACEBOOK_CLIENT_SECRET",
					//     clientId: "FACEBOOK_CLIENT_ID"
					// })
				]
			}),
			Session.init({
				jwt: {
					enable: true,
				},
				// cookieDomain: "localhost"
			}), // initializes session features
			UserMetadata.init(),
		]
	});
}

export default initSupertokens;

