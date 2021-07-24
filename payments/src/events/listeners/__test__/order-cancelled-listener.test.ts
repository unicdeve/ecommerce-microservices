import { OrderCancelledEvent, OrderStatus } from '@unicdeve/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const orderId = mongoose.Types.ObjectId().toHexString();
	// create and save a ticket
	const order = Order.build({
		id: orderId,
		version: 0,
		status: OrderStatus.Created,
		price: 99.99,
		userId: 'knlkn',
	});
	await order.save();

	// create the fake data event
	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: 1,
		ticket: {
			id: 'klnknd',
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, order };
};

it('updates the status of the order, and acks the message', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

	expect(msg.ack).toHaveBeenCalled();
});
