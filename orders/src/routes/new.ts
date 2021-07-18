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
		// Find an order with the same ticket ID and
		// make sure the order status is NOT cancelled
		const existingOrder = await Order.findOne({
			ticket,
			status: {
				$in: [
					OrderStatus.Created,
					OrderStatus.AwaitingPayment,
					OrderStatus.Completed,
				],
			},
		});

		if (existingOrder) throw new BadRequestError('Ticket is already reserved.');

		// Calculate an expiration date for this order

		// Build the order and save it to DB

		// TODO: Publish OrderCreated event

		res.status(201).send('new order');
	}
);

export { router as createOrderRouter };
