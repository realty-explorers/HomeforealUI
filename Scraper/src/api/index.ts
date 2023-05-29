import express from 'express';
import dealsRouter from './routes/dealsRouter';
import locationRouter from './routes/locationRouter';
import AuthMiddleware from '../auth/auth_middleware';

export default () => {
	const app = express.Router();
	const authMiddleware = new AuthMiddleware();
	app.use(authMiddleware.verifyRequest);
	app.use('/deals', dealsRouter);
	app.use('/location', locationRouter);
	return app;
};
