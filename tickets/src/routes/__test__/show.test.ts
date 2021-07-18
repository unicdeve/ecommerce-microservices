import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns status 404 if ticket is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).expect(404);
});

it('returns the ticket if found', async () => {
	const title = 'test title';
	const price = 120;

	const cookie = global.signin();

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		})
		.expect(201);

	const id = res.body.id;

	const ticketRes = await request(app).get(`/api/tickets/${id}`).expect(200);

	expect(ticketRes.body.title).toEqual(title);
	expect(ticketRes.body.price).toEqual(price);
});
