import { requireAuth, validateRequest } from '@unicdeve/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
	'/api/orders',
	requireAuth,
	[body('ticketId').not().isEmpty().withMessage('TicketID is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		res.status(201).send('new order');
	}
);

export { router as createOrderRouter };
