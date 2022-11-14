import APIGatewayServer from '../api_gateway';
import { mock, MockProxy, mockFn } from 'jest-mock-extended';
import { sleep } from '../utils/utils';
import axios from 'axios';
// import { Range } from '../models/range';
import express from 'express';
import mockAxios from 'jest-mock-axios';
// import RangeRepository from '../data/range_repository';

describe('API Gateway', () => {
	let path = 'amqp://localhost';
	let queue = 'queue';
	let exchange = 'exchange';
	let exchangeKey = 'status';
	let expressApp: express.Application;
	let apiGateway: APIGatewayServer;
	// let rangeRepository: MockProxy<RangeRepository>;
	// beforeEach(() => {
	// 	// rangeRepository = mock<RangeRepository>();
	// 	expressApp = express();
	// 	apiGateway = new APIGatewayServer(
	// 		expressApp
	// 		// rangeRepository
	// 	);
	// });

	// afterEach(async () => {
	// 	mockAxios.reset();
	// });

	// it('should be running', async () => {
	// 	await apiGateway.start();
	// 	await apiGateway.stop();
	// 	expect(apiGateway).toBeDefined();
	// });
});
