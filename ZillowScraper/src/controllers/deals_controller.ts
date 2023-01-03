import { Router, Request, Response, NextFunction } from 'express';
import DealsService from '../services/deals_service';
import { ParsedQs } from 'qs';

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class DealsController {
	private dealsService: DealsService;

	constructor() {
		this.dealsService = new DealsService();
	}

	public findDeals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { regionSelection, distance, profit, soldMinPrice, soldMaxPrice, daysOnZillow } = req.body;
			console.log(req.body);
			// const zillowSearchUrl = req.query['zillowSearchUrl'] as string;
			// const distance = parseInt(req.query['distance'] as string);
			// const profit = parseInt(req.query['profit'] as string);
			// const soldMinPrice = parseInt(req.query['soldMinPrice'] as string);
			// const soldMaxPrice = parseInt(req.query['soldMaxPrice'] as string);
			// const daysOnZillow = req.query['daysOnZillow'] as string;
			const response = await this.dealsService.getDeals(regionSelection, distance, profit, soldMinPrice, soldMaxPrice, daysOnZillow);
			res.json(response);
		} catch (error: any) {
			console.log(error);
			res.status(500).send({ error: error.message });
			// res.send();
		}
	};

}
