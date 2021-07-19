import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns an err if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404);
});

it('returns an err if the ticket is already reserved', async () => {});

it('reserves a ticket', async () => {});
