import { Request, Response, NextFunction } from 'express';
import Authentication from '../utils/Authentication';
import BaseRoutes from './base/BaseRouter';
import { AuthenticationController } from '../controllers/AuthenticationController';
import { validateRegister } from '../validators/UserValidator';
import { validate } from '../validators/Validate';

class AuthenticationRoutes extends BaseRoutes {
	constructor() {
		super(new AuthenticationController());
	}
	routes(): void {
		this.router.post('/login', this.controller.login);
		this.router.post('/register' ,validateRegister, validate, this.controller.register);
	}
}

export default new AuthenticationRoutes().router;
