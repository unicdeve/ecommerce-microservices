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
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
	queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const { orderId } = data;
		const order = await Order.findById(orderId).populate('ticket');

		if (!order) throw new NotFoundError();

		if (order.status === OrderStatus.Completed) return msg.ack();

		order.set({ status: OrderStatus.Cancelled });
		await order.save();

		await new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.version,
			ticket: { id: order.ticket.id },
		});

		msg.ack();
	}
}
