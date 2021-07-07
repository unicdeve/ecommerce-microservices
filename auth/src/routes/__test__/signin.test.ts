import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			password: 'password',
			email: 'test@test.com',
		})
		.expect(400);
});

it('fails when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			password: 'password',
			email: 'test@test.com',
		})
		.expect(201);

	await request(app)
		.post('/api/users/signin')
		.send({
			password: 'p',
			email: 'test@test.com',
		})
		.expect(400);
});

it('sets a cookie after successful sign in', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			password: 'password',
			email: 'test@test.com',
		})
		.expect(201);

	const res = await request(app)
		.post('/api/users/signin')
		.send({
			password: 'password',
			email: 'test@test.com',
		})
		.expect(201);

	expect(res.get('Set-Cookie')).toBeDefined();
});
