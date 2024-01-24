import { Request, Response, NextFunction } from 'express';
export class CustomError extends Error {
	public statusCode: number;
	public statusText: string;

	constructor(message: string, statusCode: number, statusText: string) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.statusText = statusText;
	}
}

export class DuplicateError extends CustomError {
	constructor(message: string) {
		super(message, 409, 'Conflict');
	}
}


export class UnauthorizedError extends CustomError {
	constructor(message: string) {
		super(message, 401, 'Unauthorized');
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message, 400, 'Bad Request');
	}
}

export class ContentNotFound extends CustomError {
	constructor(message: string) {
		super(message, 204, 'Content Not Found');
	}
}

export class NotEnoughAuthority extends CustomError {
	constructor(message: string) {
		super(message, 403, 'Forbidden');
	}
}

export class ServerError extends CustomError {
	constructor(message: string) {
		super(message, 500, 'Internal Server Error');
	}
}


export class NotFound extends CustomError {
	constructor(message: string = 'Record not found') {
		super(message, 404, 'Not Found');
	}
}

export class RecordExistsError extends CustomError {
	constructor(message: string = 'Record already exists') {
		super(message, 409, 'Bad Request');
	}
}

export function handleErrorController(error: any, res: Response) {
	const status = error.statusCode || 500;
	const statusText = error.statusText || 'Internal Server Error';
	const message = error.message || 'Something went wrong';
	res.status(status).json({
		status: statusText,
		message: message,
	});
}

export function handleErrorFunction(error: any): never {
	console.log(error);
	if (error instanceof CustomError) {
		throw error;
	} else {
		throw new ServerError(error.message);
	}
}
