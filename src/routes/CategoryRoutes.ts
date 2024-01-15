import { CategoryController } from "../controllers/CategoryController";
import { validateDeleteCategory, validateGetCategory, validateUpdateCategory } from "../validators/CategoryValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CategoryRoutes extends BaseRoutes {
	constructor() {
		super(new CategoryController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getCategories);
        this.router.get('/:categoryId',validateGetCategory, validate, this.controller.getCategory);
        this.router.post('/', this.controller.createCategory);
        this.router.delete('/:categoryId',validateDeleteCategory, validate, this.controller.deleteCategory);
        this.router.put('/:categoryId',validateUpdateCategory, validate, this.controller.updateCategory);
	}
}

export default new CategoryRoutes().router;
