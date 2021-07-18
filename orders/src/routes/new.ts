import { requireAuth, validateRequest } from '@unicdeve/common';
// import { body } from 'express-validator';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
	'/api/orders',
	requireAuth,
	// [
	// 	body('title').not().isEmpty().withMessage('Title is required'),
	// 	body('price')
	// 		.isFloat({ gt: 0 })
	// 		.withMessage('Price must be greater than 0'),
	// ],
	validateRequest,
	async (req: Request, res: Response) => {
		res.status(201).send('new order');
	}
);

export { router as createOrderRouter };
