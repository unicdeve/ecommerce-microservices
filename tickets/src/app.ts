import express, { json } from 'express';
import 'express-async-errors';
import { errHandler, NotFoundError, currentUser } from '@unicdeve/common';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUser);

app.use(createTicketRouter);

app.all('*', async () => {
	throw new NotFoundError();
});

// middlewares
app.use(errHandler);

export { app };