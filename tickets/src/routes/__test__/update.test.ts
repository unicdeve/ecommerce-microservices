import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

jest.mock('../../nats-wrapper.ts');

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

it('returns 400 if invalid inputs', async () => {
	const sameUserCookie = global.signin();
	const res = await request(app)
		.post(`/api/tickets`)
		.send({
			title: 'new title',
			price: 1233,
		})
		.set('Cookie', sameUserCookie);

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.send({
			title: '',
			price: 1000,
		})
		.set('Cookie', sameUserCookie)
		.expect(400);

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.send({
			title: 'siknk',
			price: -120,
		})
		.set('Cookie', sameUserCookie)
		.expect(400);
});

it('update the ticket if valid inputs', async () => {
	const sameUserCookie = global.signin();
	const res = await request(app)
		.post(`/api/tickets`)
		.send({
			title: 'new title',
			price: 1233,
		})
		.set('Cookie', sameUserCookie);

	const newTitle = 'some new title';
	const newPrice = 120;
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.send({
			title: newTitle,
			price: newPrice,
		})
		.set('Cookie', sameUserCookie)
		.expect(200);

	const updatedTicketRes = await request(app)
		.get(`/api/tickets/${res.body.id}`)
		.expect(200);

	expect(updatedTicketRes.body.title).toEqual(newTitle);
	expect(updatedTicketRes.body.price).toEqual(newPrice);
});
