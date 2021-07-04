import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
// import { app } from '../app';

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
