// import { NotFoundError } from '@unicdeve/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
	// const { orderId } = req.params;

	// if (!ticket) throw new NotFoundError();

	res.send('orders');
});

export { router as showOrderRouter };
