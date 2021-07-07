import request from 'supertest';
import { app } from '../../app';

it('successfully sign out', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			password: 'password',
			email: 'test@test.org',
		})
		.expect(201);

	const res = await request(app).get('/api/users/signout').send().expect(200);

	expect(res.get('Set-Cookie')[0]).toEqual(
		'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
	);
});
