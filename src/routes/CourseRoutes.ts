import { CourseController } from "../controllers/CourseController";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CourseRoutes extends BaseRoutes {
	constructor() {
		super(new CourseController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getCourses);
		this.router.get('/:courseId', this.controller.getCourse);
	}
}

export default new CourseRoutes().router;
