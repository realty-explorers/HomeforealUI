import { Router, Request, Response, NextFunction } from 'express';
import DealsService from '../services/deals_service';
import { ParsedQs } from 'qs';

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class DealsController {
	private dealsService: DealsService;

	constructor() {
		this.dealsService = new DealsService();
	}

	public findProperties = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { city, state, soldPropertiesMaxAge, forSalePropertiesMaxAge } = req.body;
			console.log(req.body);
			const response = await this.dealsService.findProperties(city, state, soldPropertiesMaxAge, forSalePropertiesMaxAge);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
		}
	};

	public findDeals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { address, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, soldAge, forSaleAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths } = req.body;
			console.log(req.body);
			const response = await this.dealsService.findDeals(address, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, soldAge, forSaleAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
		}
	};


}
