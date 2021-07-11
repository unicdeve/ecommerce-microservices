import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns status 404 if ticket is not found', async () => {
	const cookie = global.signin();
	const res = await request(app)
		.get('/api/tickets/fake_id')
		.set('Cookie', cookie)
		.send({})
		.expect(404);
});

it('returns status the ticket if found', async () => {
	const cookie = global.signin();
	const title = 'test title';
	const price = 120;

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		})
		.expect(201);

	const ticketRes = await request(app)
		.post(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.expect(200);

	expect(ticketRes.body.title).toEqual(title);
	expect(ticketRes.body.price).toEqual(price);
});
