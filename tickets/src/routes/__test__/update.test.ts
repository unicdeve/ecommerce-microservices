import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns status 404 if ticket is not found', async () => {
	const cookie = global.signin();
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'new title',
			price: 1233,
		})
		.set('Cookie', cookie)
		.expect(404);
});

it('returns status other than 401 if user is signed in', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'new title',
			price: 1233,
		})
		.expect(401);
});

it('returns status other than 401 if user does not own ticket', async () => {
	const res = await request(app)
		.post(`/api/tickets`)
		.send({
			title: 'new title',
			price: 1233,
		})
		.set('Cookie', global.signin())
		.expect(201);

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.send({
			title: 'new title',
			price: 1000,
		})
		.set('Cookie', global.signin())
		.expect(401);
});

it('update the ticket if valid inputs', async () => {
	const cookie = global.signin();
});
