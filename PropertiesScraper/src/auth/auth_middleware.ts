import { NextFunction, Response, Request } from 'express';
import User from '../models/user';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
// import { getToken } from "next-auth/jwt";
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';

interface RequestWithUser extends Request {
	user?: User;
}

class AuthMiddleware {

	private pems: { [key: string]: any };

	constructor() {
		this.pems = {};
		this.setUp();
	}


	public verifyRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
		try {
			// const secret = process.env.NEXTAUTH_SECRET!;
			// const cookie = req.cookies['next-auth.session-token'];
			// //decode cookie

			// const decodedToken = jwt.verify(cookie, secret);
			// console.log('decodedToken: ' + decodedToken);
			// console.log('cookie: ' + cookie);
			// const token: any = await getToken({ req, secret: secret });
			// if (token) {
			// 	const jwtData = this.verifyToken(token.accessToken);
			// 	const user: User = {
			// 		id: token.sub,
			// 		name: token.email,
			// 		email: token.email,
			// 	}
			// 	req.user = user;
			// 	next();
			// }
			// else {
			// 	res.status(401).send({
			// 		error: 'Authentication error',
			// 	});
			// }
			req.user = {
				id: 'name',
				name: 'name',
				email: 'name@name.com'
			}
			next();
		} catch (error) {
			console.log(error);
			res.status(401).send({ error });
		}
	};

	private verifyToken = (token: string) => {
		let decodedJwt: any = jwt.decode(token, { complete: true });
		if (decodedJwt === null) {
			throw Error("Unauthorized");
		}
		let kid = decodedJwt.header.kid;
		let pem = this.pems[kid];
		if (!pem) {
			throw Error("Unauthorized");
		}
		const data = jwt.verify(token, pem);
		return data;
	}

	private async setUp() {
		const poolRegion: string = process.env.AWS_REGION!;
		const userPoolId: string = process.env.AWS_COGNITO_USER_POOL_ID!;
		const URL = `https://cognito-idp.${poolRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

		try {
			const response = await fetch(URL);
			if (response.status !== 200) {
				throw 'request not successful'
			}
			const data = await response.json();
			const { keys } = data;
			for (let i = 0; i < keys.length; i++) {
				const key_id = keys[i].kid;
				const modulus = keys[i].n;
				const exponent = keys[i].e;
				const key_type = keys[i].kty;
				const jwk = { kty: key_type, n: modulus, e: exponent };
				const pem = jwkToPem(jwk);
				this.pems[key_id] = pem;
			}
			console.log("got PEMS")
		} catch (error) {
			console.log(error)
			console.log('Error! Unable to download JWKs');
		}
	}
}

// const verifyToken = async (token: string) => {
// 	console.log('token: ' + token);
// 	// const region = process.env.AWS_REGION;
// 	// const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
// 	// const clientId = process.env.AWS_COGNITO_CLIENT_ID;
// 	// const params = {
// 	// 	AccessToken: token,
// 	// };
// 	// const client = new CognitoIdentityProviderClient({ region });
// 	// const command = new GetUserCommand(params);
// 	// console.log('meow1');
// 	// const userData = await client.send(command);
// 	// console.log('meow2');
// 	// console.log(userData);
// 	// const email = userData.UserAttributes!.find((attr) => attr.Name === "email")?.Value;
// 	// const id = userData.UserAttributes!.find((attr) => attr.Name === "sub")?.Value;
// 	// const user = { id: id!, email: email!, name: email! };
// 	// return user;
// }


export default AuthMiddleware;
export { RequestWithUser };
