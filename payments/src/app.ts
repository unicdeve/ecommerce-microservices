import express, { json } from 'express';
import 'express-async-errors';
import { errHandler, NotFoundError, currentUser } from '@unicdeve/common';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';
// import { showTicketRouter } from './routes/show';
// import { indexTicketRouter } from './routes';
// import { updateTicketRouter } from './routes/update';

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

app.use(createChargeRouter);
// app.use(indexTicketRouter);
// app.use(showTicketRouter);
// app.use(updateTicketRouter);

app.all('*', async () => {
	throw new NotFoundError();
});

// middlewares
app.use(errHandler);

export { app };
