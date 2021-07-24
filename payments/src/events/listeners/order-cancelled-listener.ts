import {
	Listener,
	NotFoundError,
	OrderCancelledEvent,
	OrderStatus,
	Subjects,
} from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		const { id, version } = data;

		const order = await Order.findOne({ _id: id, version: version - 1 });

		if (!order) throw new NotFoundError();

		order.set({ status: OrderStatus.Cancelled });
		await order.save();

		msg.ack();
	}
}
