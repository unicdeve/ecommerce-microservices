import { requireAuth } from '@unicdeve/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.delete(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		// const { orderId } = req.params;

		res.send('Delete route');
	}
);

export { router as deleteOrderRouter };
