import { Router, Request, Response, NextFunction } from 'express';
import DealsService from '../services/deals_service';
import { ParsedQs } from 'qs';
import { RequestWithUser } from '../auth/auth_middleware';

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class DealsController {
	private dealsService: DealsService;

	constructor() {
		this.dealsService = new DealsService();
	}

	public findProperties = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const city = req.query['city'] as string;
			const state = req.query['state'] as string;
			const display = req.query['display'] as string;
			const type = req.query['type'] as string;
			const soldPropertiesMaxAge = parseInt(req.query['soldPropertiesMaxAge'] as string);
			const forSalePropertiesMaxAge = parseInt(req.query['forSalePropertiesMaxAge'] as string);
			const userId = req.user!.name;
			const response = await this.dealsService.findProperties(userId, display, type, city, state, soldPropertiesMaxAge, forSalePropertiesMaxAge);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
		}
	};

	public findDeals = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { buyBox, updatedProperty } = req.body;
			const userId = req.user!.name;
			const response = await this.dealsService.findDeals(userId, buyBox, updatedProperty);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
		}
	};

	public findGeneralDeals = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const buyBox = {
				"compsMaxDistance": 1,
				"underComps": 0,
				"minArv": 0,
				"maxArv": 1000000,
				"minPrice": 0,
				"maxPrice": 1000000,
				"onSaleDays": 180,
				"onSoldDays": 180,
				"forSaleMinArea": 500,
				"forSaleMaxArea": 10000,
				"soldMinArea": 500,
				"soldMaxArea": 10000,
				"minBeds": 1,
				"maxBeds": 9,
				"minBaths": 1,
				"maxBaths": 9,
				// "propertyTypes": ["single_family"]
			}
			const userId = req.user!.name;
			const response = await this.dealsService.findDeals(userId, buyBox);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
		}
	};


}
