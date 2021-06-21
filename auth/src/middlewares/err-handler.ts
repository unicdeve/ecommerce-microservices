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
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	if (err instanceof DBConnectionError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	res.status(400).send({ errors: [{ message: 'Something went wrong.' }] });
};
