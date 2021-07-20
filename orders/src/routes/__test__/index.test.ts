import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 40,
	});
	return await ticket.save();
};

it("fetches user's orders", async () => {
	// create 3 tickets
	const ticket_1 = await buildTicket();
	const ticket_2 = await buildTicket();
	const ticket_3 = await buildTicket();

	const user_1 = global.signin();
	const user_2 = global.signin();

	// create one order as User #1
	await request(app)
		.post('/api/orders')
		.set('Cookie', user_1)
		.send({ ticketId: ticket_1.id })
		.expect(201);

	// create 2 orders as User #2
	const { body: user_2_order_1 } = await request(app)
		.post('/api/orders')
		.set('Cookie', user_2)
		.send({ ticketId: ticket_2.id })
		.expect(201);

	const { body: user_2_order_2 } = await request(app)
		.post('/api/orders')
		.set('Cookie', user_2)
		.send({ ticketId: ticket_3.id })
		.expect(201);

	// make request to get orders User #2
	const res = await request(app)
		.get('/api/orders')
		.set('Cookie', user_2)
		.expect(200);

	// make sure we get the orders for specifically for User #2
	expect(res.body.length).toEqual(2);
	expect(res.body[0].id).toEqual(user_2_order_1.id);
	expect(res.body[1].id).toEqual(user_2_order_2.id);
	expect(res.body[0].ticket.id).toEqual(ticket_2.id);
	expect(res.body[1].ticket.id).toEqual(ticket_3.id);
});
