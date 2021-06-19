import express from 'express';
import { json } from 'body-parser';

const app = express();

app.use(json());

app.get('/api/users/current-user', (req, res) => {
	res.send('Hi Taiwo again!');
});

app.listen(3000, () => {
	console.log('Listent on port: 3000');
});
