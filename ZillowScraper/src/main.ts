import express from 'express';
import App from './app';
import RabbitmqConnection from './connections/amqp/rabbitmq_connection';

const startApp = async () => {
	const expressApp = express();
	const rabbitmq_connection = new RabbitmqConnection();
	const app = new App(
		expressApp,
		rabbitmq_connection
	);
	await app.start();
};

startApp();