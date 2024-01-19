import { CourseController } from "../controllers/CourseController";
import { validateGetCourse, validateGetCourses } from "../validators/CourseValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CourseRoutes extends BaseRoutes {
	constructor() {
		super(new CourseController());
	}
	public routes(): void {
		this.router.get('/',validateGetCourses, validate, this.controller.getCourses);
		this.router.get('/:courseId',validateGetCourse, validate, this.controller.getCourse);
	}
}

export default new CourseRoutes().router;
