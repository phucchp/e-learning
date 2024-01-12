import { CategoryController } from "../controllers/CategoryController";
import BaseRoutes from "./base/BaseRouter";


class CategoryRoutes extends BaseRoutes {
	constructor() {
		super(new CategoryController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getCategories);

	}
}

export default new CategoryRoutes().router;
