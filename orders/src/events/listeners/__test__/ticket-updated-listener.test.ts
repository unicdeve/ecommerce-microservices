import { TicketUpdatedEvent } from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
	// creates an instance of the Listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	// create and save a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'test title',
		price: 120,
	});
	await ticket.save();

	// create a fake data event
	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: 'updated title',
		price: 99.99,
		userId: 'some random user',
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
	const { listener, ticket, data, msg } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);
	// write assertions to make sure a ticket was created!
	const newTicket = await Ticket.findById(ticket.id);

	expect(newTicket).toBeDefined();
	expect(newTicket!.title).toEqual(data.title);
	expect(newTicket!.price).toEqual(data.price);
	expect(newTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);

	// write assertions to make sure ack fun was called
	expect(msg.ack).toHaveBeenCalled();
});

it("doesn't call ack if the event is out of order", async () => {
	const { listener, data, msg, ticket } = await setup();

	data.version = 10;

	try {
		await listener.onMessage(data, msg);
	} catch (err) {}

	expect(msg.ack).not.toHaveBeenCalled();
});
