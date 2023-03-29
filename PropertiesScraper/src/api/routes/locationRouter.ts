import express from 'express';
import LocationController from '../../controllers/location_controller';
import authMiddleware from '../../auth/auth_middleware';


const locationRouter = express.Router();
const locationController = new LocationController();
locationRouter.all('/*', authMiddleware);
locationRouter.get('/suggest', locationController.getSuggestions);

export default locationRouter;
