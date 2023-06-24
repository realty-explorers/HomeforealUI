import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import App from './connections/rest/express_app';
import express from 'express';
import AMQPConnection from './connections/amqp/amqp_connection';

export default class APIGatewayServer {
	private expressApp: express.Application;
	private expressServer: App;
	private amqpConnection: AMQPConnection;

	constructor(
		expressApp: express.Application,
		amqpConnection: AMQPConnection
	) {
		validateEnv();
		this.expressApp = expressApp;
		this.expressServer = new App(this.expressApp);
		this.amqpConnection = amqpConnection;
	}

	public async start() {
		try {
			this.expressServer.startServer(process.env.PORT || '');
			await this.amqpConnection.connect(process.env.AMQP_PATH!);
			await this.subscribeChannels();
			await this.amqpConnection.consume(process.env.UPDATES_QUEUE!);
		} catch (error) {
			console.log(error);
		}
	}

	private handleBackendMessages(data: any) {
		try {
			console.log('from backend ********8');
			console.log(data);
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
		// const message: Message = { Topic: 'status', Data: data };
		console.log(data.toString());

		// this.websocketConnection.send(data.toString());
	}

	public async stop() {
		await this.amqpConnection.stopConsume();
		await this.amqpConnection.close();
		this.expressServer.stopServer();
	}
}
