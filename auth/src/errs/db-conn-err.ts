import { CustomError } from './custom-err';

export class DBConnectionError extends CustomError {
	reason = 'Error connecting to database!';
	statusCode = 500;

	constructor() {
		super('Error connecting to DB.');

		Object.setPrototypeOf(this, DBConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
