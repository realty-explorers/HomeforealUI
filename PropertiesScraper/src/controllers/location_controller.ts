import { Router, Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import LocationService from '../services/location_service';
import { getToken } from "next-auth/jwt"

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class LocationController {
	private locationService: LocationService;

	constructor() {
		this.locationService = new LocationService();
	}

	public getSuggestions = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const searchTerm = req.query['searchTerm'] as string;
			const response = await this.locationService.getLocationSuggestions(searchTerm);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
		}
	};

}
