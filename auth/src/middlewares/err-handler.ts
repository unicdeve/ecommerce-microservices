import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errs/custom-err';

export const errHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	res.status(400).send({ errors: [{ message: 'Something went wrong.' }] });
};
