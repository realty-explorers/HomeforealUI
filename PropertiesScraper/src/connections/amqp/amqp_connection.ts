import * as amqp from 'amqplib/callback_api';

interface AMQPConnection {
	connect: (path: string) => Promise<void>;
	subscribe: (
		queue: string,
		exchange_name: string,
		key: string,
		action: (data: any) => Promise<void>
	) => Promise<void>;
	consume: (queue: string) => Promise<void>;
	stopConsume: () => Promise<void>;
	close: () => Promise<void>;
}

export default AMQPConnection;
