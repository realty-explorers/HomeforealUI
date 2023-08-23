import express from 'express';
import DealsController from '../../controllers/deals_controller';

const dealsRouter = express.Router();
const dealsController = new DealsController();
dealsRouter.get('/findProperties', dealsController.findProperties);
dealsRouter.post('/findDeals', dealsController.findDeals);
dealsRouter.get('/findGeneralDeals', dealsController.findGeneralDeals);

export default dealsRouter;
