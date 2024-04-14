import { CategoryController } from "../controllers/CategoryController";
import { auth, authAdmin } from "../middlewares/AuthMiddleware";
import { validateDeleteCategory, validateGetCategory, validateUpdateCategory } from "../validators/CategoryValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";
import express, { Application, Request, Response, NextFunction } from 'express';


class CategoryRoutes extends BaseRoutes {
	constructor() {
		super(new CategoryController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getCategories);
        this.router.get('/:categoryId',validateGetCategory, validate, this.controller.getCategory);
        this.router.post('/',auth, authAdmin, this.controller.createCategory);
        this.router.delete('/:categoryId',auth, authAdmin, validateDeleteCategory, validate, this.controller.deleteCategory);
        this.router.put('/:categoryId',auth, authAdmin, validateUpdateCategory, validate, this.controller.updateCategory);
	}
}

export default new CategoryRoutes().router;
