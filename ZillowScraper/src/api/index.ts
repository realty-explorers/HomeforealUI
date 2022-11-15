import express from 'express';
import dealsRouter from './routes/dealsRouter';

export default () => {
	const app = express.Router();
	app.use('/deals', dealsRouter);
	return app;
};
