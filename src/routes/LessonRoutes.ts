import { LessonController } from "../controllers/LessonController";
import { auth, authInstructor, authUser } from "../middlewares/AuthMiddleware";
import { validateCreateLessons, validateGetLesson, validateDeleteLesson,validateUpdateLesson, validateGetUrlUploadVideo, validateGetSubtitle, validateGetPresignUrlUpdateSubtitle, validateAddSubtitle, validateDeleteSubtitle  } from "../validators/LessonValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class LessonRoutes extends BaseRoutes {
	constructor() {
		super(new LessonController());
	}
	public routes(): void {
		this.router.get('/:lessonId',auth, authUser, validateGetLesson, this.controller.getLesson);
		this.router.post('/',auth, authInstructor, validateCreateLessons, validate, this.controller.createLessons);
		this.router.delete('/:lessonId',auth, authInstructor, validateDeleteLesson, validate, this.controller.deleteLesson);
		this.router.put('/:lessonId',auth, authInstructor, validateUpdateLesson, validate, this.controller.updateLesson);
		this.router.get('/presign-url/upload-video', auth, authInstructor, validateGetUrlUploadVideo, validate, this.controller.getLinkUpdateVideo);
		// Subtitle for lesson
		this.router.get('/:lessonId/subtitles',auth, validateGetSubtitle, validate, this.controller.getSubtitle);
		this.router.get('/subtitles/:subtitleId/presigned-url', auth, authInstructor, validateGetPresignUrlUpdateSubtitle, validate, this.controller.getPresignUrlUpdateSubtitle); // Get link subtitles by language code
		this.router.post('/:lessonId/subtitles', auth, authInstructor, validateAddSubtitle, validate, this.controller.addSubtitle);
		this.router.delete('/subtitles/:subtitleId', auth, authInstructor, validateDeleteSubtitle, validate, this.controller.deleteSubtitle);
	}
}

export default new LessonRoutes().router;
