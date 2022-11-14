import { Router, Request, Response, NextFunction } from 'express';
import DealsService from '../services/deals_service';
import { ParsedQs } from 'qs';
import TestPlanData from '../models/test_plan_data';
// import RangeRepository from '../data/range_repository';
// import ElasticRangeRepository from '../data/elastic_range_repository';

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class DealsController {
	private dealsService: DealsService;

	constructor() {
		this.dealsService = new DealsService();
	}

	public getDeals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const response = await this.dealsService.getDeals();
			res.json(response);
		} catch (error) {
			res.status(500).send({ error });
		}
	};

}
