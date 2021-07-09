import express, { json } from 'express';
import 'express-async-errors';
import { errHandler, NotFoundError } from '@unicdeve/common';
import cookieSession from 'cookie-session';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.all('*', async () => {
	throw new NotFoundError();
});

// middlewares
app.use(errHandler);

export { app };
