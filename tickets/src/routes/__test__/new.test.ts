import request from 'supertest';
import { app } from '../../app';

it('has a route handler for /api/tickets', async () => {
	const res = await request(app).post('/api/tickets').send({});

	expect(res.status).not.toEqual(404);
});

it('can only be accessed if authenticated', async () => {
	await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns status other than 401 if user is signed in', async () => {
	global.signin();
	const res = await request(app).post('/api/tickets').send({});

	expect(res.status).not.toEqual(401);
});

it('returns error if invalid price is given', async () => {});

it('returns error if invalid title is given', async () => {});

it('creates a ticket if valid params are provided', async () => {});
