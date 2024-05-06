import { LessonController } from "../controllers/LessonController";
import { auth, authInstructor, authUser } from "../middlewares/AuthMiddleware";
import { validateCreateLessons, validateGetLesson, validateDeleteLesson,validateUpdateLesson, validateGetUrlUploadVideo  } from "../validators/LessonValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class LessonRoutes extends BaseRoutes {
	constructor() {
		super(new LessonController());
	}
	public routes(): void {
		this.router.get('/:lessonId',auth, authUser, validateGetLesson, this.controller.getLesson);
		this.router.post('/',authInstructor, validateCreateLessons, validate, this.controller.createLessons);
		this.router.delete('/:lessonId',authInstructor, validateDeleteLesson, validate, this.controller.deleteLesson);
		this.router.put('/:lessonId',authInstructor, validateUpdateLesson, validate, this.controller.updateLesson);
		this.router.get('/presign-url/upload-video', authInstructor, validateGetUrlUploadVideo, validate, this.controller.getLinkUpdateVideo);
		// Subtitle for lesson
		this.router.get('/:lessonId/subtitles', this.controller.getLesson); // Get all subtitles hiện có của lesson (kh bao gồm link)
		this.router.get('/:lessonId/subtitles/presign-url', this.controller.getSubtitle); // Get link subtitles by language code
		this.router.get('/:lessonId/subtitles/presign-url-to-update/:languageCode', this.controller.getPresignUrlUpdateSubtitle);
		this.router.delete('/:lessonId/subtitles/:languageCode', this.controller.deleteSubtitle);
	}
}

export default new LessonRoutes().router;
