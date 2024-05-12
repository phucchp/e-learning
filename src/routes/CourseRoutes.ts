import { CourseController } from "../controllers/CourseController";
import { auth, authInstructor, authUser } from "../middlewares/AuthMiddleware";
import { validateGetCourse, validateGetCourses, validateUpdateCourse, validateCreateCourse, validateCreateTopic, validateDeleteTopic, validateUpdateTopic } from "../validators/CourseValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CourseRoutes extends BaseRoutes {
	constructor() {
		super(new CourseController());
	}
	public routes(): void {
		this.router.get('/', validateGetCourses, validate, this.controller.getCourses);
		this.router.get('/:courseId', authUser, validateGetCourse, validate, this.controller.getCourse);
		this.router.get('/:courseId/presigned-url-to-upload-poster', auth, authInstructor, this.controller.getPresignedUrlToUploadPoster);
		this.router.get('/:courseId/clear-cache-poster', auth, authInstructor, this.controller.clearCachePoster);
		this.router.get('/:courseId/reviews', this.controller.getReviewsOfCourse);
		this.router.put('/:courseId', auth, authInstructor, validateUpdateCourse, validate, this.controller.updateCourse);
		this.router.post('/', auth, authInstructor, validateCreateCourse, validate, this.controller.createCourse);
		// Topic
		this.router.post('/:courseId/topics/', auth, authInstructor, validateCreateTopic, validate, this.controller.createTopic);
		this.router.put('/topics/:topicId', auth, authInstructor, validateUpdateTopic, validate, this.controller.updateTopic);
		this.router.delete('/topics/:topicId', auth, authInstructor, validateDeleteTopic, validate, this.controller.deleteTopic);
	}
}

export default new CourseRoutes().router;
