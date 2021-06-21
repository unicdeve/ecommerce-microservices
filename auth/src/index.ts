import express, { json } from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { errHandler } from './middlewares/err-handler';
import { NotFoundError } from './errs/not-found-err';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
	})
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*', async () => {
	throw new NotFoundError();
});

// middlewares
app.use(errHandler);

const start = async () => {
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to mongoDB');
	} catch (e) {
		console.error(e);
	}

	app.listen(3000, () => {
		console.log('Listent on port: 3000');
	});
};

start();
