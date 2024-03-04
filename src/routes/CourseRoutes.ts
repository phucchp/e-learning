import { CourseController } from "../controllers/CourseController";
import { auth, authInstructor, authUser } from "../middlewares/AuthMiddleware";
import { validateGetCourse, validateGetCourses, validateUpdateCourse, validateCreateCourse } from "../validators/CourseValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CourseRoutes extends BaseRoutes {
	constructor() {
		super(new CourseController());
	}
	public routes(): void {
		this.router.get('/', validateGetCourses, validate, this.controller.getCourses);
		this.router.get('/:courseId', authUser, validateGetCourse, validate, this.controller.getCourse);
		this.router.get('/:courseId/reviews', this.controller.getReviewsOfCourse);
		this.router.put('/:courseId', auth, authInstructor, validateUpdateCourse, validate, this.controller.updateCourse);
		this.router.post('/', auth, authInstructor,validateCreateCourse, validate, this.controller.createCourse);

	}
}

export default new CourseRoutes().router;
