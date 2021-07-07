import request from 'supertest';
import { app } from '../../app';

it('responds with current user', async () => {
	const cookie = await global.signin();

	const res = await request(app)
		.get('/api/users/current-user')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with currentUser with null if not signed in', async () => {
	const res = await request(app)
		.get('/api/users/current-user')
		.send()
		.expect(200);

	expect(res.body.currentUser).toEqual(null);
});
