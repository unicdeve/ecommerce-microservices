import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
		}
	}
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

global.signin = () => {
	const id = mongoose.Types.ObjectId().toHexString();
	const payload = {
		email: 'test@test.com',
		id,
	};

	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString('base64');

	return [`express:sess=${base64}`];
};
