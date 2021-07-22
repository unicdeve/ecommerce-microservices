import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
	var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'snkjnkj';
	mongo = new MongoMemoryServer();
	await mongo.start();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let col of collections) {
		await col.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
});

global.signin = async (): Promise<string[]> => {
	const email = 'test@test.com';
	const password = 'password';

	const res = await request(app)
		.post('/api/users/signup')
		.send({
			email,
			password,
		})
		.expect(201);

	const cookie = res.get('Set-Cookie');

	return cookie;
};
