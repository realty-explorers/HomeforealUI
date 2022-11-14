import express from 'express';
import APIGatewayServer from './api_gateway';
import RabbitmqConnection from './connections/amqp/rabbitmq_connection';
import WsWebsocketConnection from './connections/websocket/ws_websocket';

const startApp = async () => {
	const expressApp = express();
	const frontend_connection = new WsWebsocketConnection();
	const rabbitmq_connection = new RabbitmqConnection();
	const api_gateway = new APIGatewayServer(
		expressApp,
		frontend_connection,
		rabbitmq_connection
	);
	await api_gateway.start();
};

startApp();
