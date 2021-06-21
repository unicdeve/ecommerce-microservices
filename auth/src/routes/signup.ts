import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errs/bad-request-err';
import { RequestValidationError } from '../errs/request-validation-err';
import { User } from '../models/user';

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
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Email already in use', 'email');
		}

		const newUser = User.build({ email, password });

		await newUser.save();

		res.status(201).send(newUser);
	}
);

export { router as signUpRouter };
