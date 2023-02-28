import express from 'express';
import DealsController from '../../controllers/deals_controller';

const dealsRouter = express.Router();
const dealsController = new DealsController();
dealsRouter.post('/findNewDeals', dealsController.findNewDeals);
dealsRouter.post('/findProperties', dealsController.findAllProperties);
dealsRouter.post('/findDeals', dealsController.findDeals);

export default dealsRouter;
