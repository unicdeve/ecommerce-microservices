import { TicketCreatedEvent } from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	// creates an instance of the Listener
	const listener = new TicketCreatedListener(natsWrapper.client);

	// create a fake data event
	const data: TicketCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		title: 'test title',
		price: 120,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);
	// write assertions to make sure a ticket was created!
	const ticket = await Ticket.findById(data.id);

	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage func with the data object + message obj
	await listener.onMessage(data, msg);

	// write assertions to make sure ack fun was called
	expect(msg.ack).toHaveBeenCalled();
});
