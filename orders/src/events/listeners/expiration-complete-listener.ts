import {
	Listener,
	Subjects,
	ExpirationCompleteEvent,
	NotFoundError,
	OrderStatus,
} from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-names';
import { Order } from '../../models/order';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
	queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const { orderId } = data;
		const order = await Order.findById(orderId);

		if (!order) throw new NotFoundError();

		order.set({ status: OrderStatus.Cancelled });
		await order.save();

		// msg.ack();
	}
}
