import {
	Listener,
	NotFoundError,
	OrderCreatedEvent,
	Subjects,
} from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const {
			id,
			status,
			userId,
			version,
			ticket: { price },
		} = data;

		const order = Order.build({
			id,
			price,
			status,
			version,
			userId,
		});
		await order.save();

		msg.ack();
	}
}
