import { requireAuth, validateRequest } from '@unicdeve/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/tickets',
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

		const newTicket = Ticket.build({
			title,
			price,
			userId: req.currentUser!.id,
		});
		await newTicket.save();

		new TicketCreatedPublisher(natsWrapper.client).publish({
			id: newTicket.id,
			title: newTicket.title,
			price: newTicket.price,
			userId: req.currentUser!.id,
		});

		res.status(201).send(newTicket);
	}
);

export { router as createTicketRouter };
