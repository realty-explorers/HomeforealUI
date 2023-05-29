import express from 'express';
import LocationController from '../../controllers/location_controller';


const locationRouter = express.Router();
const locationController = new LocationController();
locationRouter.get('/suggest', locationController.getSuggestions);
locationRouter.get('/data', locationController.getLocationData)

export default locationRouter;
