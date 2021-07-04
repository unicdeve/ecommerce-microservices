import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errs/bad-request-err';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Email already in use', 'email');
		}

		const newUser = User.build({ email, password });

		await newUser.save();

		// Generate JWT
		const userJwt = jwt.sign(
			{
				id: newUser._id,
				email: newUser.email,
			},
			process.env.JWT_KEY!
		);

		// store on session
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(newUser);
	}
);

export { router as signUpRouter };
