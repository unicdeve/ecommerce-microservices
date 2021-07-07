import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.org',
			password: 'password',
		})
		.expect(201);
});

it('returns a 400 with invalid email', () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test.org',
			password: 'password',
		})
		.expect(400);
});

it('returns a 400 with missing password', () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.org',
			password: 'p',
		})
		.expect(400);
});

it('returns a 400 with missing email and password', () => {
	return request(app).post('/api/users/signup').send({}).expect(400);
});

it('returns a 400 with missing email or password', async () => {
	await request(app).post('/api/users/signup').send({
		password: 'password',
	});
	await request(app)
		.post('/api/users/signup')
		.send({ email: 'test@test.org' })
		.expect(400);
});
