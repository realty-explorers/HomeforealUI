import express from 'express';
import testRunnerRouter from './routes/test_runner_router';
import dealsRouter from './routes/dealsRouter';

export default () => {
	const app = express.Router();
	app.use('/testPlan', dealsRouter);
	return app;
};
