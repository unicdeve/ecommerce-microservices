import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
	res.send('Hi Taiwo againjkj');
});

export { router as signInRouter };
