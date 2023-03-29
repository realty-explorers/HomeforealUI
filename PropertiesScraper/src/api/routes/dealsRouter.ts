import express from 'express';
import DealsController from '../../controllers/deals_controller';
import authMiddleware from '../../auth/auth_middleware';

const dealsRouter = express.Router();
const dealsController = new DealsController();
dealsRouter.all('/*', authMiddleware);
dealsRouter.post('/findProperties', dealsController.findProperties);
dealsRouter.post('/findDeals', dealsController.findDeals);

export default dealsRouter;
