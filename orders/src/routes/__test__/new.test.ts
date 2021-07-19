import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('returns an err if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404);
});

it('returns an err if the ticket is already reserved', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 40,
	});
	await ticket.save();

	const order = Order.build({
		ticket,
		userId: 'some_user_id',
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});
	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(400);
});

it('reserves a ticket', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 40,
	});
	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);
});

it.todo('emits an OrderCreated event');
