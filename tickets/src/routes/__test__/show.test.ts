import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns status 404 if ticket is not found', async () => {
	await request(app).get('/api/tickets/fake_id').expect(404);
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
