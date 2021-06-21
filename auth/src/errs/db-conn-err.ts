export class DBConnectionError extends Error {
	reason = 'Error connecting to database!';
	statusCode = 500;

	constructor() {
		super();

		// because we are extending a builtin class
		Object.setPrototypeOf(this, DBConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
