import { Request, Response, NextFunction } from 'express';
import Authentication from '../utils/Authentication';
import BaseRoutes from './base/BaseRouter';
import { AuthenticationController } from '../controllers/AuthenticationController';
import { validateChangePassword, validateChangePasswordUsingToken, validateActiveUser, validateForgotPassword, validateLogin, validateRegister, validateGetAccessToken } from '../validators/UserValidator';
import { validate } from '../validators/Validate';
import { auth } from '../middlewares/AuthMiddleware';

class AuthenticationRoutes extends BaseRoutes {
	constructor() {
		super(new AuthenticationController());
	}
	routes(): void {
		this.router.post('/login', validateLogin, validate, this.controller.login);
		this.router.post('/admin/login', validateLogin, validate, this.controller.login);
		this.router.post('/register',validateRegister, validate, this.controller.register);
		this.router.get('/active', validateActiveUser, validate, this.controller.activeUser);
		this.router.post('/users/change-password', auth, validateChangePassword, validate, this.controller.changePassword);
		this.router.post('/users/forgot-password', validateForgotPassword, this.controller.forgotPassword);
		this.router.post('/users/change-password-token', validateChangePasswordUsingToken, validate, this.controller.changePasswordUsingToken);
		this.router.post('/get-access-token',validateGetAccessToken,validate, this.controller.getAccessToken);
	}
}

export default new AuthenticationRoutes().router;
