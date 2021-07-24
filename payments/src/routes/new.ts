import { requireAuth, validateRequest } from '@unicdeve/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.post(
	'/api/payments',
	requireAuth,
	[
		body('token').not().isEmpty().withMessage('Token is required'),
		body('orderId').not().isEmpty().withMessage('Order ID is required'),
	],
	validateRequest,
	(req: Request, res: Response) => {
		res.send({ success: true });
	}
);

export { router as createChargeRouter };
