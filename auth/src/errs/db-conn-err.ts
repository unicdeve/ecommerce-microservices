export class DBConnectionError extends Error {
	reason = 'Error connecting to database!';

	constructor() {
		super();

		// because we are extending a builtin class
		Object.setPrototypeOf(this, DBConnectionError.prototype);
	}
}
