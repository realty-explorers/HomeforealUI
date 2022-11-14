import express from 'express';
import DealsController from '../../controllers/deals_controller';

const dealsRouter = express.Router();
const dealsController = new DealsController();
dealsRouter.get('/', dealsController.getDeals);

export default dealsRouter;
