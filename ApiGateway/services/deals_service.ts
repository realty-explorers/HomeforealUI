// import { Range } from '../models/range';
// import RangeRepository from '../data/range_repository';
import axios from 'axios';
import ElasticTestPlanRepository from '../data/elastic_test_plan_repository';
import TestPlanData from '../models/test_plan_data';

export default class DealsService {
	private dealsControllerUrl: string;
	private elasticTestPlanRepository: ElasticTestPlanRepository;

	constructor() {
		this.elasticTestPlanRepository = new ElasticTestPlanRepository();
		this.elasticTestPlanRepository.connect();
		this.dealsControllerUrl = 'http://localhost:5000/api';
	}

	public getDeals = async () => {
		try {
			const response = await axios.get(
				`${this.dealsControllerUrl}/TestPlan/?name=${name}`
			);
			if (response.status !== 200) throw Error(response.data);
			return response.data;
		} catch (error: any) {
			console.log(error);
			throw Error(error);
		}
	};
}
