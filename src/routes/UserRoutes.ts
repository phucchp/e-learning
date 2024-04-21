import { UserController } from "../controllers/UserController";
import { auth } from "../middlewares/AuthMiddleware";
import { validateAddFavoriteCourse, validateDeleteFavoriteCourse } from "../validators/CourseValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";

class UserRoutes extends BaseRoutes {
	constructor() {
		super(new UserController());
	}

	public routes(): void {
		this.router.get('/carts', auth, this.controller.getCarts);
		this.router.delete('/carts',auth, this.controller.deleteCourseFromCart);
		this.router.post('/carts',auth, this.controller.addCourseToCart);
		this.router.get('/enrollment-courses',auth, this.controller.getEnrollmentCourses);
		this.router.get('/favorite-courses',auth, this.controller.getFavoriteCourses);
		this.router.post('/favorite-courses',auth, validateAddFavoriteCourse, validate, this.controller.addCourseFavorite);
		this.router.delete('/favorite-courses',auth, validateDeleteFavoriteCourse, validate, this.controller.deleteCourseFavorite);
	}
}

export default new UserRoutes().router;
