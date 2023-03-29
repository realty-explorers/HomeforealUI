import { NextFunction, Response, Request } from 'express';
import { getToken } from 'next-auth/jwt';
import User from '../models/user';

interface RequestWithUser extends Request {
	user?: User;
}

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
	try {
		const secret = process.env.NEXTAUTH_SECRET;
		const token = await getToken({ req, secret })
		if (token) {
			const user: User = {
				email: token.email as string,
				password: token.password as string,
				name: token.name as string
			};
			if (user) {
				req.user = user;
				next();
			} else {
				res.status(401).send({
					error: 'Authentication error',
				});
			}
		} else {
			res.status(401).send({
				error: 'Authentication error',
			});
		}
	} catch (error) {
		res.status(500).send({ error });
	}
};

export default authMiddleware;
export { RequestWithUser };
