import { UserController } from "../controllers/UserController";
import { auth } from "../middlewares/AuthMiddleware";
import BaseRoutes from "./base/BaseRouter";

class UserRoutes extends BaseRoutes {
	constructor() {
		super(new UserController());
	}

	public routes(): void {
		this.router.get('/carts', auth, this.controller.getCarts);
		this.router.delete('/carts',auth, this.controller.deleteCourseFromCart);
		this.router.post('/carts',auth, this.controller.addCourseToCart);
		this.router.get('/enrollment-courses', this.controller.getEnrollmentCourses);
	}
}

export default new UserRoutes().router;
