import {
	Listener,
	Subjects,
	PaymentCreatedEvent,
	NotFoundError,
	OrderStatus,
} from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-names';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
		const { orderId } = data;
		const order = await Order.findById(orderId);

		if (!order) throw new NotFoundError();

		order.set({ status: OrderStatus.Completed });
		await order.save();

		// TODO: you might want to publish OrderUpdatedEvent here, to tell all other service

		msg.ack();
	}
}
