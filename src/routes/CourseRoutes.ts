import { CourseController } from "../controllers/CourseController";
import { auth, authInstructor, authUser } from "../middlewares/AuthMiddleware";
import { validateGetCourse,validateGetCoursesElasticsearch, validateGetCourses, validateUpdateCourse, validateCreateCourse, validateCreateTopic, validateDeleteTopic, validateUpdateTopic, validateGetQuestion } from "../validators/CourseValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CourseRoutes extends BaseRoutes {
	constructor() {
		super(new CourseController());
	}
	public routes(): void {
		this.router.get('/', validateGetCourses, validate, this.controller.getCourses);
		this.router.get('/hihi', validateGetCourses, validate, this.controller.getCourseByElasticsearch);
		this.router.get('/elasticsearch', validateGetCoursesElasticsearch, validate, this.controller.searchCourses);
		this.router.get('/courses-for-instructor', auth, authInstructor, validateGetCourses, validate, this.controller.getAllCourseOfInstructor);
		this.router.get('/filters', this.controller.getAllFilterFoSearchCourse);
		this.router.get('/debug/get-courses' , this.controller.getCoursesDebug);
		this.router.get('/test', this.controller.test);
		this.router.get('/:courseId', authUser, validateGetCourse, validate, this.controller.getCourse);
		this.router.get('/:courseId/presigned-url-to-upload-poster', auth, authInstructor, this.controller.getPresignedUrlToUploadPoster);
		this.router.get('/:courseId/presigned-url-to-upload-trailer', auth, authInstructor, this.controller.getPresignedUrlToUploadTrailer);
		this.router.get('/:courseId/clear-cache-poster', auth, authInstructor, this.controller.clearCachePoster);
		this.router.get('/:courseId/clear-cache-trailer', auth, authInstructor, this.controller.clearCacheTrailer);
		this.router.get('/:courseId/reviews', this.controller.getReviewsOfCourse);
		this.router.put('/:courseId', auth, authInstructor, validateUpdateCourse, validate, this.controller.updateCourse);
		this.router.post('/', auth, authInstructor, validateCreateCourse, validate, this.controller.createCourse);
		// Topic
		this.router.post('/:courseId/topics/', auth, authInstructor, validateCreateTopic, validate, this.controller.createTopic);
		this.router.put('/topics/:topicId', auth, authInstructor, validateUpdateTopic, validate, this.controller.updateTopic);
		this.router.delete('/topics/:topicId', auth, authInstructor, validateDeleteTopic, validate, this.controller.deleteTopic);
		this.router.get('/recommends/recommend-courses', authUser, this.controller.getRecommendCourse);
		this.router.get('/recommends/recommend-courses-based-on-click', this.controller.getRecommendCourseClient);
		this.router.get('/recommends/recommend-courses-based-on-tags',authUser, this.controller.getRecommendCourseBasedOnTags);
		this.router.get('/recommends/v1/recommend-courses-based-on-click', this.controller.getRecommendCourseBasedOneTagForClient);
		this.router.get('/recommends/collaborative-filtering',authUser, this.controller.getCoursesRecommendBasedOnCollaborativeFiltering);
		this.router.get('/recommends/get-courses-by-query', this.controller.getCoursesForAiRecommend);
		this.router.get('/tfidf/test', this.controller.tfidf);
		this.router.post('/topics/:topicId/questions-answers',auth, this.controller.createQA);
		this.router.delete('/topics/:topicId/questions/:questionId',auth, this.controller.deleteQuestion);
		this.router.get('/topics/:topicId/questions', auth, validateGetQuestion, validate, this.controller.getAllQuestionOfTopic);
		this.router.get('/others/get-courses-by-courseIds' , this.controller.getCoursesByCourseIds);
		// Admin
		this.router.post('/enrollments/add-user-enrollment-courses', this.controller.addUserEnrollmentCoursesForAdmin);
	}
}

export default new CourseRoutes().router;
