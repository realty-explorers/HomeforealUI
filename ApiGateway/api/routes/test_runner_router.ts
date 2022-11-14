import express, { Router } from 'express';
import TestRunnerController from '../../controllers/test_runner_controller';

export default class TestRunnerRouter {
	public router: Router;
	constructor(testRunnerController: TestRunnerController) {
		this.router = express.Router();
		this.router.post('/run', testRunnerController.run);
		this.router.get(
			'/runnableTestPlans',
			testRunnerController.getRunnableTestPlans
		);
	}
}
// const testRunnerRouter = express.Router();
// const testRunnerController = new TestRunnerController();

// testRunnerRouter.post('/run', testRunnerController.run);
// testRunnerRouter.get(
// 	'/runnableTestPlans',
// 	testRunnerController.getRunnableTestPlans
// );

// export default testRunnerRouter;
