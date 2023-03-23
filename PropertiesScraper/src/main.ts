import express from 'express';
import App from './app';
import RabbitmqConnection from './connections/amqp/rabbitmq_connection';

const test = (min?: number) => {
	const price = 600000;
	// const validMinPrice = min ? true : price >= min;
	// console.log(validMinPrice);
}

const startApp = async () => {
	// test();
	const expressApp = express();
	const rabbitmq_connection = new RabbitmqConnection();
	const app = new App(
		expressApp,
		rabbitmq_connection
	);
	await app.start();
};

startApp();