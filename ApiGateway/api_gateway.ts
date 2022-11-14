import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import App from './connections/rest/express_app';
import express from 'express';
import axios, { AxiosResponse } from 'axios';
import WebsocketConnection from './connections/websocket/websocket_connection';
import AMQPConnection from './connections/amqp/amqp_connection';
import Message from './models/message';
import TestsControllerConnection from './models/tests_controller_connection';

export default class APIGatewayServer {
	private expressApp: express.Application;
	private expressServer: App;
	private frontendConnection: WebsocketConnection;
	private amqpConnection: AMQPConnection;

	constructor(
		expressApp: express.Application,
		frontendConnection: WebsocketConnection,
		amqpConnection: AMQPConnection
		// rangeRepository: RangeRepository
	) {
		validateEnv();
		this.expressApp = expressApp;
		this.frontendConnection = frontendConnection;
		this.expressServer = new App(this.expressApp);
		this.amqpConnection = amqpConnection;
	}

	public async start() {
		try {
			this.expressServer.startServer(process.env.PORT || '');
			const frontendServer = this.expressServer.getServer();
			console.log(this.frontendConnection);
			if (frontendServer) {
				this.frontendConnection.connect(
					(ws) => {
						// var clients: any = this.backendConnection.getClients();
						// var clientsInfo = Object.keys(clients).map(
						// 	(id: string) => {
						// 		return {
						// 			location: clients[id].getLocationInfo(),
						// 			testPlans: clients[id].getTestPlans(),
						// 			progress: clients[id].getProgress(),
						// 		};
						// 	}
						// );
						// var data = { Topic: 'status', Data: clientsInfo };
						// console.log(JSON.stringify(data));
						// ws.send(JSON.stringify(data));
					},
					(message) => { },
					() => { },
					frontendServer,
					'/'
				);
			}

			await this.amqpConnection.connect(process.env.AMQP_PATH!);
			await this.subscribeChannels();
			await this.amqpConnection.consume(process.env.UPDATES_QUEUE!);
			// await this.elasticTestPlanRepository.connect();
		} catch (error) {
			console.log(error);
		}
	}

	private handleBackendMessages(data: any) {
		try {
			console.log('from backend ********8');
			console.log(data);
			console.log(this.frontendConnection);
			this.frontendConnection.broadcast(data);
		} catch (error: any) {
			console.log(error);
		}
	}

	private async subscribeChannels() {
		await this.amqpConnection.subscribe(
			process.env.UPDATES_QUEUE!,
			process.env.UPDATES_EXCHANGE!,
			'update',
			async (data: any) => {
				await this.handleUpdateMessage(data);
			}
		);
	}

	private async handleUpdateMessage(data: Buffer) {
		console.log(data);
		// var update: Message = JSON.parse(data.toString());
		const message: Message = { Topic: 'status', Data: data };
		console.log(data.toString());
		this.frontendConnection.broadcast(data.toString());

		// this.websocketConnection.send(data.toString());
	}

	private validateStatusCode(response: AxiosResponse) {
		if (response.status !== 200) throw new Error(response.data);
	}

	public async stop() {
		await this.amqpConnection.stopConsume();
		await this.amqpConnection.close();
		this.frontendConnection.close();
		this.expressServer.stopServer();
		// await this.elasticTestPlanRepository.closeConnection();
		// await this.rangeRepository.closeConnection();
	}
}
