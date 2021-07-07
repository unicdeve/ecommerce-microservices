import request from 'supertest';
import { app } from '../../app';

it('responds with current user', async () => {
	const authRes = await request(app)
		.post('/api/users/signup')
		.send({
			password: 'password',
			email: 'test@test.org',
		})
		.expect(201);

	const cookie = authRes.get('Set-Cookie');

	const res = await request(app)
		.get('/api/users/current-user')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(res.body.currentUser.email).toEqual('test@test.org');
});
