import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined!');

	try {
		await mongoose.connect('mongodb://tickets-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to tickets service mongoDB');
	} catch (e) {
		console.error(e);
	}

	app.listen(3000, () => {
		console.log('Listent on port: 3000');
	});
};

start();
