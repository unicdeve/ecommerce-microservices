import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 40,
	});
	return await ticket.save();
};

it("fetches user's single order", async () => {
	const ticket = await buildTicket();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it('returns 401 if the order is not created by the user', async () => {
	const ticket = await buildTicket();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', global.signin())
		.expect(401);
});
