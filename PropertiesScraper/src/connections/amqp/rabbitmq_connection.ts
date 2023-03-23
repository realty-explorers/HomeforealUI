import AMQPConnection from './amqp_connection';
import * as amqp from 'amqplib';

export default class RabbitmqConnection implements AMQPConnection {
	private connection: amqp.Connection | undefined;
	private channel: amqp.Channel | undefined;
	private consumer: amqp.Replies.Consume | undefined;
	private consuming: Boolean;
	private subscriptions: { [key: string]: (data: any) => void };

	constructor() {
		this.consuming = false;
		this.subscriptions = {};
	}

	public async connect(path: string) {
		this.connection = await amqp.connect(path);
		this.channel = await this.connection.createChannel();
		this.connection.on('error', (err) => {});
		this.channel.on('error', (err) => {});
	}

	public async subscribe(
		queue: string,
		exchange_name: string,
		key: string,
		action: (data: any) => Promise<void>
	) {
		if (this.channel) {
			this.validateConsumerNotActive();
			await this.channel.bindQueue(queue, exchange_name, key);
			this.subscriptions[key] = action;
		}
	}

	public async consume(queue: string) {
		if (this.channel) {
			this.validateConsumerNotActive();
			this.consuming = true;
			try {
				this.consumer = await this.channel.consume(
					queue,
					(message: amqp.ConsumeMessage | null) => {
						if (message) {
							if (message.fields.routingKey in this.subscriptions)
								this.subscriptions[message.fields.routingKey](
									message.content
								);
							this.channel?.ack(message);
						}
					},
					{
						// manual acknowledgment mode,
						// see ../confirms.html for details
						noAck: false,
					}
				);
			} catch (error: any) {
				console.log('erorr');
				this.consuming = false;
			}
		}
	}

	public async stopConsume() {
		if (this.channel && this.consuming && this.consumer) {
			await this.channel.cancel(this.consumer.consumerTag);
			this.consuming = false;
		}
	}

	private validateConsumerNotActive() {
		if (this.consuming) throw Error('Consumer is in progress');
	}

	public async close() {
		if (this.channel) await this.channel.close();
		if (this.connection) await this.connection.close();
	}
}
