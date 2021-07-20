import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const buildTicket = async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 40,
	});
	return await ticket.save();
};

it("cancels user's order", async () => {
	const ticket = await buildTicket();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.patch(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a OrderCancelled event', async () => {
	const ticket = await buildTicket();
	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.patch(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
