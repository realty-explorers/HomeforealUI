import express from 'express';
import dealsRouter from './routes/dealsRouter';
import locationRouter from './routes/locationRouter';

export default () => {
	const app = express.Router();
	app.use('/deals', dealsRouter);
	app.use('/location', locationRouter);
	return app;
};
