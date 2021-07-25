import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@unicdeve/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/payments',
	requireAuth,
	[
		body('token').not().isEmpty().withMessage('Token is required'),
		body('orderId').not().isEmpty().withMessage('Order ID is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Order.findById(orderId);

		if (!order) throw new NotFoundError();

		if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

		if (order.status === OrderStatus.Cancelled)
			throw new BadRequestError('Order cancelled already.');

		const charge = await stripe.charges.create({
			currency: 'usd',
			amount: parseFloat((order.price * 100).toFixed(2)),
			source: token,
		});

		const payment = Payment.build({
			orderId,
			stripeId: charge.id,
		});
		await payment.save();
		new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			stripeId: payment.stripeId,
			orderId: payment.orderId,
		});

		res.status(201).send({ paymentId: payment.id });
	}
);

export { router as createChargeRouter };
