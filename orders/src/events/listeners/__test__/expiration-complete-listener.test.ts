import { ExpirationCompleteEvent, OrderStatus } from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
	// creates an instance of the Listener
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'sknk',
		price: 3,
	});

	await ticket.save();

	const order = Order.build({
		userId: 'knkn',
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket,
	});

	await order.save();

	// create a fake data event
	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id,
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, order, ticket };
};

it('updates the order status to cancelled', async () => {
	const { listener, data, msg, order, ticket } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
	const { listener, data, msg, order, ticket } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const publishedEventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(publishedEventData.id).toEqual(order.id);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);

	// write assertions to make sure ack fun was called
	expect(msg.ack).toHaveBeenCalled();
});
