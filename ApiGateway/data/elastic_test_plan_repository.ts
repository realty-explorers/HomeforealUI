import TestPlanData from '../models/test_plan_data';
import {
	Client,
	ApiResponse,
	RequestParams,
	Connection,
	ClientOptions,
} from '@elastic/elasticsearch';
import Measurement from '../models/measurement';
import MeasurementData from '../models/measurement_data';
import { json } from 'envalid';

const TEST_PLAN_INDEX = 'test_plans';
const MEASUREMENTS_INDEX = 'tests_measurements';
const MEASUREMENTS_DATA_INDEX = 'tests_measurements_data';
export default class ElasticTestPlanRepository {
	private clientOptions: ClientOptions;
	private client: Client | undefined;
	private fieldKeys: { [key: string]: string };

	constructor() {
		this.clientOptions = {
			node: process.env.ELASTIC_CLOUD_URL || '',
			auth: {
				username: process.env.ELASTIC_USERNAME || '',
				password: process.env.ELASTIC_PASSWORD || '',
			},
		};
		this.fieldKeys = {
			testPlanName: 'testPlanName',
			unitName: 'unit.name',
			unitSerial: 'unit.serial',
			status: 'status',
			overallStatus: 'overallStatus',
			inputPort: 'inputPort',
			outputPort: 'outputPort',
		};
	}
	public connect = async () => {
		this.client = new Client(this.clientOptions);
	};

	public closeConnection = async () => {
		await this.client?.close();
	};

	public deleteAllFromIndex = async (index: string) => {
		try {
			let res = await this.client?.indices.delete({
				index,
			});
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	public getTestPlanById = async (id: string) => {
		try {
			const results = await this.client!.get<TestPlanData>({
				index: TEST_PLAN_INDEX,
				id,
			});
			return results.body;
		} catch (error) {
			console.log(error);
		}
	};

	public getMeasurementsById = async (ids: string[]) => {
		try {
			const results: ApiResponse = await this.client!.search<Measurement>(
				{
					index: MEASUREMENTS_INDEX,
					body: {
						query: {
							ids: {
								values: ids,
							},
						},
					},
				}
			);
			return results;
		} catch (error) {
			console.log(error);
		}
	};

	public getMeasurementsDataById = async (ids: string[]) => {
		try {
			const results: ApiResponse =
				await this.client!.search<MeasurementData>({
					index: MEASUREMENTS_DATA_INDEX,
					body: {
						query: {
							ids: {
								values: ids,
							},
						},
					},
					size: 10000,
				});
			return results;
		} catch (error) {
			console.log(error);
		}
	};

	public getPagesCount = async (index: string) => {
		const search_params = {
			index: index,
			body: {
				query: {
					match_all: {},
				},
			},
		};
		var count = await this.client?.count(search_params);
		return count;
	};

	public getPage = async (index: string, page: number, perPage: number) => {
		const search_params = {
			index: index,
			body: {
				sort: [
					{
						time: {
							order: 'desc',
						},
					},
				],
				query: {
					match_all: {},
				},
				size: perPage,
				from: (page - 1) * perPage,
			},
		};
		let results: ApiResponse | undefined;
		try {
			results = await this.client!.search(search_params);
		} catch (error) {
			console.log(error);
		}
		return results;
	};

	public searchTestPlans = async (
		page: number,
		perPage: number,
		testPlanNames?: string[],
		unitNames?: string[],
		unitSerials?: string[],
		statuses?: string[],
		dateRange?: { startDate: string; endDate: string }
	) => {
		const search_params: any = this.constructQuery(
			TEST_PLAN_INDEX,
			page,
			perPage,
			[
				{ key: this.fieldKeys['testPlanName'], value: testPlanNames },
				{ key: this.fieldKeys['unitName'], value: unitNames },
				{ key: this.fieldKeys['unitSerial'], value: unitSerials },
				{ key: this.fieldKeys['status'], value: statuses },
			],
			dateRange
		);
		let results: ApiResponse | undefined;
		try {
			results = await this.client!.search(search_params);
		} catch (error) {
			console.log(error);
		}
		return results;
	};

	public searchMeasurements = async (
		page: number,
		perPage: number,
		testPlanNames?: string[],
		unitNames?: string[],
		unitSerials?: string[],
		overallStatuses?: string[],
		inputPorts?: string[],
		outputPorts?: string[],
		dateRange?: { startDate: string; endDate: string }
	) => {
		const search_params: any = this.constructQuery(
			MEASUREMENTS_INDEX,
			page,
			perPage,
			[
				{ key: this.fieldKeys['testPlanName'], value: testPlanNames },
				{ key: this.fieldKeys['unitName'], value: unitNames },
				{ key: this.fieldKeys['unitSerial'], value: unitSerials },
				{
					key: this.fieldKeys['overallStatus'],
					value: overallStatuses,
				},
				{ key: this.fieldKeys['inputPort'], value: inputPorts },
				{ key: this.fieldKeys['outputPort'], value: outputPorts },
			],
			dateRange
		);
		let results: ApiResponse | undefined;
		try {
			results = await this.client!.search(search_params);
		} catch (error) {
			console.log(error);
		}
		return results;
	};

	private constructQuery(
		index: string,
		page: number,
		perPage: number,
		termFields: { key: string; value: string[] | undefined }[],
		dateRange: { startDate: string; endDate: string } | undefined
	) {
		const mustQueries: any[] = [];
		termFields.forEach((termField) => {
			if (termField.value)
				mustQueries.push(
					this.constructElasticMatchQuery(
						termField.key,
						termField.value
					)
				);
		});
		let search_params: any = {
			index: index,
			body: {
				sort: [
					{
						time: {
							order: 'desc',
						},
					},
				],
				query: {
					bool: {
						must: mustQueries,
					},
				},
				size: perPage,
				from: (page - 1) * perPage,
			},
		};
		if (dateRange) {
			search_params.body.query.bool.filter = {
				range: {
					time: {
						gte: dateRange.startDate,
						lte: dateRange.endDate,
					},
				},
			};
		}
		return search_params;
	}

	private constructElasticMatchQuery(key: string, value: any) {
		return { match: { [key]: value.join(' ') } };
	}
}
