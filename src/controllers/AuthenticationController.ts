
import { NextFunction, Request, Response } from 'express';
import Container, { Inject, Service } from 'typedi';
import { AuthenticationService } from '../services/AuthenticationService';
import Authentication from '../utils/Authentication';
import { IAuthenticationService } from '../services/interfaces/IAuthenticationService';
import { ServerError } from '../utils/CustomError';


export class AuthenticationController {
	private authenticationService: IAuthenticationService;

	constructor() {
		this.authenticationService = Container.get(AuthenticationService);
	}

	/**
	 * API login for user
	 */
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

	/**
	 * Register new account for user
	 */
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

	/**
	 * Active user registration using token from mail
	 */
	activeUser = async (req: Request, res: Response) => {
		const { token } = req.query;
		if(!token) {
			return res.status(404).json({
				message: "No token"
			});
		}
		const result = await this.authenticationService.activeUser(token.toString());
		if (result) {
			res.redirect('http://localhost:8000/');
		}

		return res.status(404).json({
			message: "Failed"
		});
	};

	/**
	 *  API change password for user (already login)
	 */
	changePassword = async (req: Request, res: Response) => {
		const userId = req.payload.userId;
		const { oldPassword, newPassword } = req.body;
		await this.authenticationService.changePassword(
			userId,
			oldPassword,
			newPassword
		);

		return res.status(200).json({
			status: 'Ok!',
			message: 'Success',
		});
	};

	/**
	 *  API change password for user (already login)
	 */
	changePasswordUsingToken = async (req: Request, res: Response) => {
		const {token, newPassword} = req.body;
		const result = await this.authenticationService.changePasswordUsingToken(
			token,
			newPassword
		);
		
		if(!result) {
			throw new ServerError('Server error');
		}

		return res.status(200).json({
			status: 'Ok!',
			message: 'Success',
		});
	};

	/**
	 * API send mail forgot password for user
	 */
	forgotPassword = async (req: Request, res: Response) => {
		const { email } = req.body;
		let data = await this.authenticationService.forgotPassword(
			email,
		);

		return res.status(200).json({
			status: 'Ok!',
			message: data,
		});
	};
}