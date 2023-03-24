import {
	Client,
	ClientOptions,
} from '@elastic/elasticsearch';
import { BulkResponse } from '@elastic/elasticsearch/lib/api/types';
import { readFileSync } from 'fs';
import Property from '../models/property';
import RegionStatus from '../models/region_status';
import { constructRegionId } from '../utils/utils';

export default class PropertyRepository {
	private clientOptions: ClientOptions;
	private client?: Client;
	private readonly PROPERTY_DEFAULT_INDEX = 'properties';
	private readonly REGION_STATUS_INDEX = 'region_status';
	private readonly REGION_STATUS_PIPELINE = 'region_status_set_id';
	private readonly PROPERTY_PIPELINE = 'id pipeline';

	constructor() {
		this.clientOptions = {
			node: process.env.ELASTIC_CLOUD_URL!,
			auth: {
				username: process.env.ELASTIC_USERNAME!,
				password: process.env.ELASTIC_PASSWORD!,
			},
			tls: {
				ca: readFileSync(process.env.ELASTICSEARCH_CERTIFICATE_PATH!),
				rejectUnauthorized: false,
			}
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

	private getIndexByState = (state: string) => {
		return `${this.PROPERTY_DEFAULT_INDEX}_${state}`;
	}

	public getPropertyById = async (id: string, state: string) => {
		try {
			const results = await this.client!.get<Property>({
				index: this.getIndexByState(state),
				id,
			});
			return results._source;
		} catch (error) {
			console.log(error);
		}
	};

	public saveProperty = async (property: Property) => {
		const response = await this.client!.index({
			index: 'properties_al',
			document: property,
		});
		console.log(response);
		return response;
	}

	public updateRegionStatus = async (regionStatus: RegionStatus) => {
		const response = await this.client!.index({
			index: this.REGION_STATUS_INDEX,
			id: regionStatus.id,
			document: regionStatus,
		});
		console.log(response);
		return response;
	}


	public getRegionStatus = async (city: string, state: string) => {
		try {
			const results = await this.client!.get<RegionStatus>({
				index: this.REGION_STATUS_INDEX,
				id: constructRegionId(city, state)
			})
			return results._source;
		} catch (error) {
			console.log(error);
		}
	}

	private countResults = async (index: string, query: any) => {
		const search_params = { index, body: { query } }
		const count = await this.client?.count(search_params);
		return count?.count;
	}

	private createPointInTime = async (index: string, keepAlive: string) => {
		const response = await this.client?.openPointInTime({ index, keep_alive: keepAlive });
		return response?.id;
	}

	private deletePointInTime = async (id: string) => {
		const response = await this.client?.closePointInTime({ id: id });
	}

	private getAllResults = async (index: string, query: any) => {
		const queryTime = '1m';
		const search_params: any = {
			body: { query },
		};
		let results: any[] = [];
		try {
			const pointInTimeId = await this.createPointInTime(index, queryTime);
			const count = await this.countResults(index, query);
			search_params['body']['sort'] = [{ "_shard_doc": "desc" }];
			search_params['body']['pit'] = { id: pointInTimeId, keep_alive: queryTime };
			search_params['body']['size'] = 10000
			for (let i = 0; i < count!; i += 10000) {
				const response = await this.client!.search(search_params);
				const hits = response.hits.hits;
				search_params['body']['pit'] = { id: response.pit_id, keep_alive: queryTime };
				search_params['body']['search_after'] = hits[hits.length - 1].sort;
				search_params['body']['track_total_hits'] = false;
				const hitResults = response.hits.hits.map(hit => hit['_source']);
				results.push(...hitResults);
			}
			await this.deletePointInTime(pointInTimeId!);
		} catch (error) {
			console.log(error);
		}
		return results;

	}

	public getProperties = async (city: string, state: string) => {
		const propertiesSearchQuery = {
			bool: {
				must: {
					match: { city: city }
				}
			},
		}
		const index = this.getIndexByState(state);
		const results = await this.getAllResults(index, propertiesSearchQuery);
		return results
	}

	public saveProperties = async (properties: Property[], state: string) => {
		if (properties.length == 0) return;
		const index = this.getIndexByState(state);
		const operations = properties.flatMap(doc => [{ index: { _index: index, _id: doc.id } }, doc])
		const bulkResponse = await this.client!.bulk({ refresh: true, operations })
		this.handleErrors(operations, bulkResponse);
		const count = await this.client!.count({ index: index })
		console.log(`Count: ${count}`);
		return bulkResponse;
	}

	private handleErrors = (operations: any, bulkResponse: BulkResponse) => {
		if (bulkResponse.errors) {
			const erroredDocuments: any = []
			// The items array has the same order of the dataset we just indexed.
			// The presence of the `error` key indicates that the operation
			// that we did for the document has failed.
			bulkResponse.items.forEach((action: any, i) => {
				const operation = Object.keys(action)[0]
				if (action[operation].error) {
					erroredDocuments.push({
						// If the status is 429 it means that you can retry the document,
						// otherwise it's very likely a mapping error, and you should
						// fix the document before to try it again.
						status: action[operation].status,
						error: action[operation].error,
						operation: operations[i * 2],
						document: operations[i * 2 + 1]
					})
				}
			})
			console.log(erroredDocuments)
		}
	}




}
