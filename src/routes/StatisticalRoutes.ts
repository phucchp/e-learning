import { StatisticalController } from "../controllers/StatisticalController";
import { auth, authAdmin, authInstructor, authUser } from "../middlewares/AuthMiddleware";
import { validateGetRevenue, validateGetRevenueAdmin,
    validateGetRevenueByCourse, validateGetRevenueByCourseAdmin,
    validateGetRevenueByInstructor, validateGetStatisCourseByCategory,
    validateGetRevenueByCategory, validateGetRevenueCourseByCategory,
	validateGetStatisCourseByLevel, validateGetRevenueByLevel,
	validateGetRevenueCourseByLevel
 } from "../validators/StatisticalValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class StatisticalRoutes extends BaseRoutes {
	constructor() {
		super(new StatisticalController());
	}
	public routes(): void {
		this.router.get('/statistical-revenue', auth, authInstructor, validateGetRevenue, validate, this.controller.getRevenueStatistics); // Thống kê doanh thu theo tuần tháng năm ngày cho instructor
		this.router.get('/admin/statistical-revenue', auth, authAdmin, validateGetRevenueAdmin, validate, this.controller.getRevenueStatisticsForAdmin);// Thống kê doanh thu theo tuần tháng năm ngày cho admin
		this.router.get('/statistical-revenue-by-course', auth, authInstructor, validateGetRevenueByCourse, validate, this.controller.getRevenueStatisticsByCourses);// Thống kê doanh thu theo từng khoá học cho instructor
		this.router.get('/admin/statistical-revenue-by-course', auth, authAdmin, validateGetRevenueByCourseAdmin, validate, this.controller.getRevenueStatisticsByCoursesForAdmin); // Thống kê doanh thu theo khoá học cho admin
		this.router.get('/admin/statistical-revenue-by-instructor', validateGetRevenueByInstructor, validate, this.controller.getRevenueStatisticsByInstructor); // Thống kê doanh thu theo từng instructor
        // By category
		this.router.get('/statistical-courses-by-category', validateGetStatisCourseByCategory, validate, this.controller.getStatisticsCoursesByCategory); // Thống kê số lượng khoá học theo từng category
		this.router.get('/statistical-revenue-by-category', auth, authAdmin, validateGetRevenueByCategory, validate, this.controller.getRevenueStatisticsByCategory); // Thống kê doanh thu theo từng category
		this.router.get('/statistical-revenue-courses-by-category', auth, authAdmin, validateGetRevenueCourseByCategory, validate, this.controller.getRevenueStatisticsCourseByCategory); // Thống kê doanh thu các khoá học trong một category
        //By level
		this.router.get('/statistical-courses-by-level',validateGetStatisCourseByLevel, validate, this.controller.getStatisticsCoursesByLevel); // Thống kê số lượng khoá học theo từng level
		this.router.get('/statistical-revenue-by-level', auth, authAdmin, validateGetRevenueByLevel, validate, this.controller.getRevenueStatisticsByLevel); // Thống kê doanh thu theo từng level
		this.router.get('/statistical-revenue-courses-by-level', auth, authAdmin, validateGetRevenueCourseByLevel, validate, this.controller.getRevenueStatisticsCourseByLevel); // Thống kê doanh thu các khoá học trong một level
	}
}

export default new StatisticalRoutes().router;
