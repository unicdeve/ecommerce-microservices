import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
	statusCode = 400;
	constructor(public errors: ValidationError[]) {
		super();

		// because we are extending a builtin class
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map((err) => ({
			message: err.msg,
			field: err.param,
		}));
	}
}
