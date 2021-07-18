import request from 'supertest';
import { app } from '../../app';

jest.mock('../../nats-wrapper.ts');

const creatTickets = () => {
	const cookie = global.signin();

	return request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'bjjbjhbd',
			price: 120,
		})
		.expect(201);
};

it('fetches all tickets', async () => {
	await creatTickets();
	await creatTickets();
	await creatTickets();

	const res = await request(app).get('/api/tickets').expect(200);

	expect(res.body.length).toEqual(3);
});
