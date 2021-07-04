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
