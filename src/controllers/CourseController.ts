import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { IReviewService } from "../services/interfaces/IReviewService";
import { ReviewService } from "../services/ReviewService";
import { NotEnoughAuthority } from "../utils/CustomError";
import { ITopicService } from "../services/interfaces/ITopicService";
import { TopicService } from "../services/TopicService";

export class CourseController{
	private courseService: ICourseService;
	private reviewService: IReviewService;
	private topicService: ITopicService;

	constructor() {
		this.courseService = Container.get(CourseService);
		this.reviewService = Container.get(ReviewService);
		this.topicService = Container.get(TopicService);

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
        const userId = req.payload.userId;
        let isCourseFavorite = false;
        if(userId) {
            isCourseFavorite = await this.courseService.isCourseFavorite(course.id, userId);
        }
        return res.status(200).json({
            message: "successfully",
            data: {
                course,
                isCourseFavorite
            },
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

    updateCourse = async (req: Request, res: Response) => {
        const course = await this.courseService.updateCourse(req);
        return res.status(200).json({
            message: "successfully",
            data: course,
        });
    }

    createCourse = async (req: Request, res: Response) => {
        const course = await this.courseService.createCourse(req);
        return res.status(201).json({
            message: "successfully",
            data: course,
        });
    }

    // =================================== TOPIC ==================================
    deleteTopic = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId); // Get userId from payload
        const topicId = Number(req.params.topicId);
        const course = await this.courseService.getCourseByTopicId(topicId);
        // Check instructor is owner this course of topic
        if (course.instructorId !== userId) {
            throw new NotEnoughAuthority('User is not owner of this course');
        }

        await this.topicService.deleteTopic(topicId);

        return res.status(200).json({
            message: "Successful"
        });
    }

    updateTopic = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId); // Get userId from payload
        const topicId = Number(req.params.topicId);
        const name = req.body.name;
        const course = await this.courseService.getCourseByTopicId(topicId);
        // Check instructor is owner this course of topic
        if (course.instructorId !== userId) {
            throw new NotEnoughAuthority('User is not owner of this course');
        }

        const newTopic = await this.topicService.updateTopic(topicId, name);
        
        return res.status(200).json({
            message: "Successful",
            data: newTopic,
        });
    }

    createTopic = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId); // Get userId from payload
        const names = req.body.names;
        const courseId = req.params.courseId;
        // Check user is owner this course
        const course = await this.courseService.getCourse(courseId);
        if (course.instructorId !== userId) {
            throw new NotEnoughAuthority('User is not owner of this course');
        }

        const topics = await this.topicService.createTopics(course.id, names);
        return res.status(201).json({
            message: "Successful",
            data: topics,
        });
    }
}