import { Listener, OrderCreatedEvent, Subjects } from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

		console.log(
			`I will publish the expiration complete in ${delay / 1000}seconds`
		);

		await expirationQueue.add(
			{
				orderId: data.id,
			},
			{
				delay,
			}
		);

		msg.ack();
	}
}
