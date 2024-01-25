
import { NextFunction, Request, Response } from 'express';
import Container, { Inject, Service } from 'typedi';
import { AuthenticationService } from '../services/AuthenticationService';
import Authentication from '../utils/Authentication';
import { IAuthenticationService } from '../services/interfaces/IAuthenticationService';
import { handleErrorController } from '../utils/CustomError';


export class AuthenticationController {
	private authenticationService: IAuthenticationService;

	constructor() {
		this.authenticationService = Container.get(AuthenticationService);
	}

	login = async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const token = await this.authenticationService.login(email, password);
		const res_token = { type: 'Bearer', token: token };
		return res.status(200).json({
			status: 'Ok!',
			message: 'Successfully login!',
			result: res_token,
		});
	};

    register = async (req: Request, res: Response) => {
		const { email, username, password } = req.body;

		await this.authenticationService.register(
			email,
			username,
			password
		);

		return res.status(200).json({
			status: 'Ok',
			message: 'Successfully registerd users!',
		});
	};
}