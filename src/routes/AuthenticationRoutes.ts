import { Request, Response, NextFunction } from 'express';
import Authentication from '../utils/Authentication';
import BaseRoutes from './base/BaseRouter';
import { AuthenticationController } from '../controllers/AuthenticationController';

class AuthenticationRoutes extends BaseRoutes {
	constructor() {
		super(new AuthenticationController());
	}
	routes(): void {
		this.router.post('/login', this.controller.login);
		this.router.post('/register' ,this.controller.register);
	}
}

export default new AuthenticationRoutes().router;
