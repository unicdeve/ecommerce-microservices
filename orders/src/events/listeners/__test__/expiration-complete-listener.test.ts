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
