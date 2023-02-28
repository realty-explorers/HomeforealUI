import { Router, Request, Response, NextFunction } from 'express';
import DealsService from '../services/deals_service';
import { ParsedQs } from 'qs';

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class DealsController {
	private dealsService: DealsService;

	constructor() {
		this.dealsService = new DealsService();
	}

	public findNewDeals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { regionId, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, daysOnZillow } = req.body;
			console.log(req.body);
			const response = await this.dealsService.findNewDeals(regionId, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, daysOnZillow);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
			// res.send();
		}
	};

	public findAllProperties = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { regionId } = req.body;
			console.log(req.body);
			const response = await this.dealsService.findProperties(regionId);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
			// res.send();
		}
	};

	public findDeals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, forSaleAge, soldAge } = req.body;
			console.log(req.body);
			const response = await this.dealsService.findDeals(distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, forSaleAge, soldAge);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
			// res.send();
		}
	};


}
