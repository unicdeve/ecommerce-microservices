import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errs/bad-request-err';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password').trim().notEmpty().withMessage('Password is required.'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (!existingUser) throw new BadRequestError('Invalid creds.');

		const match = await Password.compare(existingUser.password, password);

		if (!match) throw new BadRequestError('Invalid creds.');

		// Generate JWT
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);

		// store on session
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(existingUser);
	}
);

export { router as signInRouter };
