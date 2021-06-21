import express, { json } from 'express';
// import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { errHandler } from './middlewares/err-handler';

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

// middlewares
app.use(errHandler);

app.listen(3000, () => {
	console.log('Listent on port: 3000');
});
