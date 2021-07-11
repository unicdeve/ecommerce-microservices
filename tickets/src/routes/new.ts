import { requireAuth, validateRequest } from '@unicdeve/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
	'/api/tickets',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price').isFloat({ gt: 0 }).withMessage('Price must be valid'),
	],
	validateRequest,
	(req: Request, res: Response) => {
		res.sendStatus(200);
	}
);

export { router as createTicketRouter };
