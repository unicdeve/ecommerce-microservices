import {
	requireAuth,
	validateRequest,
	NotFoundError,
	NotAuthorizedError,
} from '@unicdeve/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) throw new NotFoundError();

		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		// const newTicket = Ticket.build({
		// 	title,
		// 	price,
		// 	userId: req.currentUser!.id,
		// });
		// await newTicket.save();

		// res.status(201).send(newTicket);
	}
);

export { router as updateTicketRouter };
