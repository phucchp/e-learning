import { UserController } from "../controllers/UserController";
import { auth, authAdmin } from "../middlewares/AuthMiddleware";
import { validateAddFavoriteCourse, validateDeleteFavoriteCourse, validateGetInstructorDetail, validateGetListInstructors, validateUpdateProfile } from "../validators/CourseValidator";
import { validateGetPercentCompleteCourse, validateGetUser, validateGetUsers, validateUpdateProcessing, validateAddProcessing, validateGetNewestProcessing } from "../validators/UserValidator";
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
		this.router.get('/presign-url/upload-avatar',auth, this.controller.getPresignUrlToUploadAvatar);
		this.router.post('/cloud-front/clear-cache-avatar',auth, this.controller.clearCacheAvatar);
		this.router.get('/instructors', validateGetListInstructors, validate, this.controller.getListInstructors);
		this.router.get('/instructors/:instructorId',validateGetInstructorDetail, validate, this.controller.getInstructorDetail);
		this.router.get('/profile', auth, this.controller.getUserInformation);
		this.router.put('/profile/',auth, validateUpdateProfile, validate, this.controller.updateUserInformation);
		this.router.get('/percent-complete-course',auth, validateGetPercentCompleteCourse, validate, this.controller.getCompletionPercentageCourse);
		this.router.post('/processing',auth, validateAddProcessing, validate, this.controller.addProcessing);
		this.router.put('/processing',auth, validateUpdateProcessing, validate, this.controller.updateProcessing);
		this.router.get('/newest-processing',auth, validateGetNewestProcessing, validate, this.controller.getNewestProcessing);
		/**
		 * API for admin
		 */
		this.router.get('/:userId', auth, authAdmin, validateGetUser, validate, this.controller.getUserDetail);
		this.router.get('/', auth, authAdmin, validateGetUsers, validate, this.controller.getUsers);
		/**
		 * Recommend
		 */
		this.router.get('/courses/recommend-courses', this.controller.recommendCourse);

	}
}

export default new UserRoutes().router;
