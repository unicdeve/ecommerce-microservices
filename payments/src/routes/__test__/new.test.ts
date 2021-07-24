import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';

it('returns a 404 if order does not exist', async () => {
	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin())
		.send({
			token: 'stripe token',
			orderId: mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});

it('returns a 401 if order does not belong to the user', async () => {
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 122,
		userId: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin())
		.send({
			token: 'stripe token',
			orderId: order.id,
		})
		.expect(401);
});

it('returns a 400 if order is cancelled', async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 122,
		userId,
		version: 0,
		status: OrderStatus.Cancelled,
	});
	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin(userId))
		.send({
			token: 'stripe token',
			orderId: order.id,
		})
		.expect(400);
});
