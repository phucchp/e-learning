import { LessonController } from "../controllers/LessonController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class LessonRoutes extends BaseRoutes {
	constructor() {
		super(new LessonController());
	}
	public routes(): void {
		this.router.get('/:lessonId', this.controller.getLesson);
	}
}

export default new LessonRoutes().router;
