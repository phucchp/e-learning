import { StatisticalService } from "../services/StatisticalService";
import { ICartService } from "../services/interfaces/ICartService";
import { IStatisticalService } from "../services/interfaces/IStatisticalService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";

export class StatisticalController{
	private statisticalService: IStatisticalService;
	private courseService: ICourseService;

	constructor() {
		this.statisticalService = Container.get(StatisticalService);
		this.courseService = Container.get(CourseService);
	}

    getRevenueStatistics = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        let statisBy: string = <string>req.query.statisBy;
        let instructorId = Number(req.payload.userId);
        let courseId = req.query.courseId?.toString() || undefined;
        console.log(instructorId);
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        let result;
        if(courseId) {
            const course = await this.courseService.getCourse(courseId);
            result = await this.statisticalService.getRevenueStatistics(startDate, endDate, statisBy, instructorId,course.id);
        }else{
            result = await this.statisticalService.getRevenueStatistics(startDate, endDate, statisBy, instructorId);
        }
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    /**
     * Thống kê doanh thu theo từng khoá học của instructor or all instructor (for Admin)
     */
    getRevenueStatisticsForAdmin = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        let statisBy: string = <string>req.query.statisBy;
        let instructorId = Number(req.query.instructorId) || undefined;
        let courseId = req.query.courseId?.toString() || undefined;
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        let result;
        if(courseId) {
            const course = await this.courseService.getCourse(courseId);
            result = await this.statisticalService.getRevenueStatistics(startDate, endDate, statisBy, instructorId,course.id);
        }else{
            result = await this.statisticalService.getRevenueStatistics(startDate, endDate, statisBy, instructorId);
        }
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    /**
     * Thống kê doanh thu theo từng khoá học của instructor
     */
    getRevenueStatisticsByCourses = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        const orderPrice: string = <string>req.query.orderPrice || 'DESC';
        // Dùng cho instructor nên instructorId bắt buộc có và lấy từ payload
        const instructorId = Number(req.payload.userId);
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result = await this.statisticalService.getRevenueStatisticsByCourses(startDate, endDate, orderPrice, instructorId);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    getRevenueStatisticsByCoursesForAdmin = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        const orderPrice: string = <string>req.query.orderPrice || 'DESC';
        // Dùng cho admin nên instructorId có thể có hoặc không và lấy từ query
        const instructorId = Number(req.query.instructorId) || undefined;
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result = await this.statisticalService.getRevenueStatisticsByCourses(startDate, endDate, orderPrice, instructorId);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }


    /**
     * For Admin
     * Thống kê doanh thu của từng instructor xem instructor nào có nhiều doanh thu nhất
     * @returns 
     */
    getRevenueStatisticsByInstructor = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        let sortBy = <string>req.query.sortBy || 'instructorId'; // instructorId or total_price
        let sortType =  <string>req.query.sortType || 'ASC';// ASC or DESC
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result = await this.statisticalService.getRevenueStatisticsByInstructor(startDate, endDate, sortBy, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    /**
     * Thống kê số lượng khoá học theo từng chủ đề (category)
     * @param req 
     * @param res 
     * @returns 
     */
    getStatisticsCoursesByCategory = async (req: Request, res: Response) => {
        let sortBy = <string>req.query.sortBy || 'id'; // id or totalCourses
        let sortType =  <string>req.query.sortType || 'ASC';// ASC or DESC
        const result = await this.statisticalService.getStatisticsCoursesByCategory(sortBy, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    /**
     * Thống kê doanh thu theo từng chủ đề (category)
     * @param req 
     * @param res 
     * @returns 
     */
    getRevenueStatisticsByCategory = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        let sortBy = <string>req.query.sortBy || 'categoryId'; // categoryId or total_price
        let sortType =  <string>req.query.sortType || 'ASC';// ASC or DESC
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result =  await this.statisticalService.getRevenueStatisticsByCategory(startDate, endDate, sortBy, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
        
    }

    /**
     * Thống kê doanh thu các khoá học trong một chủ đề
     * @param req 
     * @param res 
     * @returns 
     */
    getRevenueStatisticsCourseByCategory = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        let sortBy = 'total_price';
        let sortType =  <string>req.query.sortType || 'ASC';// ASC or DESC
        const categoryId = Number(req.query.categoryId) || 1;
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result = await this.statisticalService.getRevenueStatisticsCourseByCategory(startDate, endDate, categoryId, sortBy, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    
    }

    /**
     * Thống kê doanh thu theo từng level
     * @param req 
     * @param res 
     * @returns 
     */
    getRevenueStatisticsByLevel = async (req: Request, res: Response) => {
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        let sortBy = <string>req.query.sortBy || 'id'; // id or total_price
        let sortType =  <string>req.query.sortType || 'ASC';// ASC or DESC
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result = await this.statisticalService.getRevenueStatisticsByLevel(startDate, endDate, sortBy, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    /**
     * Thống kê số lượng khoá học theo từng level
     * @param req 
     * @param res 
     * @returns 
     */
    getStatisticsCoursesByLevel = async (req: Request, res: Response) => {
        let sortBy = <string>req.query.sortBy || 'id'; // id or totalCourses
        let sortType =  <string>req.query.sortType || 'ASC';// ASC or DESC
        const result = await this.statisticalService.getStatisticsCoursesByLevel(sortBy, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }

    /**
     *  Thống kê doanh thu các khoá học trong một level
     * @param req 
     * @param res 
     * @returns 
     */
    getRevenueStatisticsCourseByLevel = async (req: Request, res: Response) => {
        let sortType =  <string>req.query.sortType || 'DESC';// ASC or DESC
        let startDate: string = <string>req.query.startDate;
        let endDate: string = <string>req.query.endDate;
        const levelId = Number(req.query.levelId) || 1;
        const currentDate = new Date();
        const tenYearAgo = new Date(currentDate);
        tenYearAgo.setFullYear(currentDate.getFullYear() - 10);
        if(!startDate){
            startDate = tenYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        if(!endDate){
            endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        const result = await this.statisticalService.getRevenueStatisticsCourseByLevel(startDate, endDate, levelId, sortType);
        return res.status(200).json({
            message: "Successfully",
            data: result
        });
    }
}
