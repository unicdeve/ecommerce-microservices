import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

jest.mock('../../nats-wrapper.ts');

it('has a route handler for /api/tickets', async () => {
	const res = await request(app).post('/api/tickets').send({});

	expect(res.status).not.toEqual(404);
});

it('can only be accessed if authenticated', async () => {
	await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns status other than 401 if user is signed in', async () => {
	const cookie = global.signin();
	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({});

	expect(res.status).not.toEqual(401);
});

it('returns error if invalid price is given', async () => {
	const cookie = global.signin();
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'some title',
			price: -120,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'some title',
		})
		.expect(400);
});

it('returns error if invalid title is given', async () => {
	const cookie = global.signin();
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			price: 10,
		})
		.expect(400);
});

it('creates a ticket if valid params are provided', async () => {
	let tickets = await Ticket.find({});

	expect(tickets.length).toEqual(0);

	const cookie = global.signin();
	const title = 'some title';

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			price: 10.9,
			title,
		})
		.expect(201);

	tickets = await Ticket.find({});
	expect(tickets[0].title).toEqual(title);
	expect(tickets[0].price).toEqual(10.9);
	expect(tickets.length).toEqual(1);
});
