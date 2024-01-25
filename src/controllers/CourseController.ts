import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { handleErrorController } from "../utils/CustomError";
import { IReviewService } from "../services/interfaces/IReviewService";
import { ReviewService } from "../services/ReviewService";

export class CourseController{
	private courseService: ICourseService;
	private reviewService: IReviewService;

	constructor() {
		this.courseService = Container.get(CourseService);
		this.reviewService = Container.get(ReviewService);

	}

    getCourses = async (req: Request, res: Response) => {
        const courses = await this.courseService.getCourses(req);
        const page = req.query.page || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        
        return res.status(200).json({
            message: "successfully",
            page: page,
            pageSize: pageSize,
            totalCount: courses.count,
            totalPages:  Math.ceil(courses.count/pageSize),
            data:courses.rows
        });
    }

    getCourse = async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const course = await this.courseService.getCourse(courseId);
        const groupReview = await this.reviewService.getStatiscalReviews(courseId);

        return res.status(200).json({
            message: "successfully",
            data: course,
            groupReview: groupReview.rows
        });
    }

    getReviewsOfCourse = async (req: Request, res: Response) => {
        const course = await this.reviewService.getReviewsOfCourse(req);
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;

        return res.status(200).json({
            message: "successfully",
            totalCount: course.count,
            page: page,
            pageSize: pageSize,
            totalPage: pageSize < course.count?Math.ceil(course.count/pageSize):course.count,
            data: course.rows,
        });
    }
}