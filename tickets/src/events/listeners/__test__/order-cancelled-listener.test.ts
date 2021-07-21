import { OrderCancelledEvent, OrderStatus } from '@unicdeve/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
	// create an instance of the listener
	const listener = new OrderCancelledListener(natsWrapper.client);

	const orderId = mongoose.Types.ObjectId().toHexString();
	// create and save a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 99.99,
		userId: 'knlkn',
	});
	ticket.set({ orderId });
	await ticket.save();

	// create the fake data event
	const data: OrderCancelledEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 2,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};

it('updates the orderId to undefine, publishes and event, and acks the message', async () => {
	const { listener, data, msg, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toBeUndefined();

	expect(msg.ack).toHaveBeenCalled();

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const publishedTicketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(publishedTicketUpdatedData.orderId).toBeUndefined();
});
