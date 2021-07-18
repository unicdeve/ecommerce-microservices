import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@unicdeve/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
	'/api/orders',
	requireAuth,
	[body('ticketId').not().isEmpty().withMessage('TicketID is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;
		// Find the ticket the user is trying to purchase
		const ticket = await Ticket.findById(ticketId);
		if (!ticket) throw new NotFoundError();

		// Make sure the ticket is not already reserved
		const isReserved = await ticket.isReserved();

		if (isReserved) throw new BadRequestError('Ticket is already reserved.');

		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		// Build the order and save it to DB
		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket,
		});

		await order.save();

		// TODO: Publish OrderCreated event

		res.status(201).send(order);
	}
);

export { router as createOrderRouter };
