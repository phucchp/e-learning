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

/**
 * Lỗi chưa được uỷ quyền, client không có quyền truy cập vào tài nguyên vì chưa xác thực
 */
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

/**
 *  Client đã được xác thực nhưng không có quyền truy cập vào tài nguyên được yêu cầu
 */
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

export function handleError(error: any,req: Request, res: Response) {
	console.log('ERROR LOG ', new Date().toLocaleString());
    console.log('Request:', req.method, req.originalUrl);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('Error: ', error);
    console.log('Error stack: ', error.stack);
    console.log("--------------------------------------------------------------------------------------");

	const status = error.statusCode || 500;
	const statusText = error.statusText || 'Internal Server Error';
	const message = error.message || 'Something went wrong';
	res.status(status).json({
		status: statusText,
		message: message,
	});
}
