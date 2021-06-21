import { Request, Response, NextFunction } from 'express';
import { DBConnectionError } from '../errs/db-conn-err';
import { RequestValidationError } from '../errs/request-validation-err';

export const errHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof RequestValidationError) {
		const formattedErr = err.errors.map((err) => ({
			message: err.msg,
			field: err.param,
		}));

		return res.status(400).send({ errors: formattedErr });
	}

	if (err instanceof DBConnectionError) {
		return res.status(500).send({ errors: [{ message: err.reason }] });
	}

	res.status(400).send({ errors: [{ message: 'Something went wrong.' }] });
};
