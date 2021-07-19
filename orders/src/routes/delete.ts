import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@unicdeve/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.patch(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;

		const order = await Order.findById(orderId).populate('ticket');

		if (!order) throw new NotFoundError();

		if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

		order.status = OrderStatus.Cancelled;
		await order.save();

		// TODO: publish OrderCancelledEvent

		res.send(order);
	}
);

export { router as deleteOrderRouter };
