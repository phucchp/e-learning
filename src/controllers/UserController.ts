import { UserService } from "../services/UserService";
import { ICartService } from "../services/interfaces/ICartService";
import { IUserService } from "../services/interfaces/IUserService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { BadRequestError, ServerError, UnauthorizedError } from "../utils/CustomError";
import { CartService } from "../services/CartService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { EnrollmentService } from "../services/EnrollmentService";
import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import { HandleS3 } from "../services/utils/HandleS3";
import { ProcessingService } from "../services/ProcessingSerivce";
import { IProcessingService } from "../services/interfaces/IProcessingService";
import { RecommenderSystem } from "../services/RecommenderSystem";

export class UserController{
	private userService: IUserService;
    private cartService: ICartService;
    private enrollmentService: IEnrollmentService;
    private courseService: ICourseService;
    private processingService: IProcessingService;
    private handleS3: HandleS3;
    private recommendSystem: RecommenderSystem;

	constructor() {
		this.userService = Container.get(UserService);
		this.cartService = Container.get(CartService);
		this.enrollmentService = Container.get(EnrollmentService);
		this.courseService = Container.get(CourseService);
		this.handleS3 = Container.get(HandleS3);
		this.processingService = Container.get(ProcessingService);
		this.recommendSystem = Container.get(RecommenderSystem);
	}
    
    //--------------CART------------------//
    getCarts = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const search = req.query.search || '';
        const result = await this.userService.getCarts(userId, search.toString());
        return res.status(200).json({
            message: "Successful",
            totalCount: result.count,
            data: result.rows,
        })
    }

    deleteCourseFromCart = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseIds = req.body.courseIds;
        const rowEffect = await this.cartService.deleteCoursesFromCart(userId, courseIds);
        return res.status(200).json({
            message: "Successful",
            rowEffect: rowEffect
        })
    }

    addCourseToCart = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseId = req.body.courseId;
        await this.cartService.addCourseToCart(userId, courseId);
        return res.status(202).json({
            message: "Successful",
        })
    }
    //--------------ENROLLMENT COURSE------------------//

    getEnrollmentCourses = async (req: Request, res: Response) => {
        const results = await this.enrollmentService.getEnrollmentCourses(req);
        return res.status(200).json({
            message : "Successful",
            totalCount: results.count,
            data: results.rows
        });
    }

    //--------------FAVORITE COURSE------------------//
    addCourseFavorite = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseId = req.body.courseId;
        await this.courseService.addCourseFavorite(courseId, userId);
        return res.status(200).json({
            message : "Successful",
        })
    }

    deleteCourseFavorite = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseId = req.body.courseId;
        await this.courseService.deleteCourseFavorite(userId, courseId);
        return res.status(200).json({
            message : "Successful",
        })
    }

    getFavoriteCourses = async (req: Request, res: Response) => {
        // const userId = req.payload.userId;
        const userId =req.payload.userId;
        const search = req.query.search || '';
        const result = await this.userService.getFavoriteCourses(userId, search.toString());
        return res.status(200).json({
            message: "Successful",
            totalCount: result.count,
            data: result.rows,
        })
    }

    /**
     * Get presign url to upload avatar user to AWS S3
     */
    getPresignUrlToUploadAvatar = async (req: Request, res: Response) => {
        const userId =req.payload.userId;
        const result = await this.userService.getPresignUrlToUploadAvatar(userId);
        return res.status(200).json({
            message: "Successful",
            url: result,
        })
    }

    /**
     * Using clear cache cloudfront after update avatar user
     */
    clearCacheAvatar = async (req: Request, res: Response) => {
        const userId =req.payload.userId;
        await this.userService.clearCacheAvatar(userId);
        return res.status(200).json({
            message: "Successful",
        });
    }

    /**
     * Get list instructors
     */
    getListInstructors = async (req: Request, res: Response) => {
        const users = await this.userService.getListInstructors(req);
        const pageSize = Number(req.query.pageSize) || 10;
        return res.status(200).json({
            message: "Successful",
            page:  Number(req.query.page) || 1,
            pageSize:  pageSize,
            totalCount: Math.ceil(users.count/pageSize),
            data: users.rows
        });
    }

    /**
     * Get instructor details
     */
    getInstructorDetail = async (req: Request, res: Response) => {
        const instructorId  = Number(req.params.instructorId);
        const profile = await this.userService.getInstructorDetail(instructorId);
        return res.status(200).json({
            message: "Successful",
            data: profile
        });
    }

    /**
     * Get user information
     */
    getUserInformation = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const data = await this.userService.getUserInformation(userId);
        if(!data.profile) { 
            throw new ServerError('Profile user not found!');
        }
        data.setDataValue('profile', await this.handleS3.getAvatarUser(data.profile))
        return res.status(200).json({
            message: "Successful",
            data:data
        });
    }
    
    /**
     * Update user profile information
     */
    updateUserInformation = async (req: Request, res: Response) => {
        const profile = await this.userService.updateUserInformation(req);
        return res.status(200).json({
            message: "Successful",
            data: profile
        });
    }

    /**
     * Get user information details for admin
     */
    getUserDetail = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const user = await this.userService.getUser(userId);
        const totalCoursesEnrollment = await this.userService.getTotalCoursesEnrollment(userId);
        const { totalPayment ,totalAmount } = await this.userService.getTotalAmountPaid(userId);
        return res.status(200).json({
            message: "Successful",
            data: {
                user: user,
                totalCoursesEnrollment: totalCoursesEnrollment,
                totalPayment: totalPayment,
                totalAmount: totalAmount
            }
        });
    }

    /**
     * Get users for admin
     */
    getUsers = async (req: Request, res: Response) => {
        const results = await this.userService.getUsers(req);
        return res.status(200).json({
            message: "Successful",
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 10,
            totalCount: results.count,
            data: results.rows
        });
    }

    /**
     * Get users for admin
     */
    getCompletionPercentageCourse = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseId = req.query.courseId;
        if (!courseId) {
            throw new BadRequestError('courseId is required');
        }
        const data = await this.userService.getCompletionPercentageCourse(userId, courseId.toString());
        return res.status(200).json({
            message: "Successful",
            data: data
        });
    }

    /**
     * API add processing course for user
     */
    addProcessing = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const lessonId = req.body.lessonId;
        const time = req.body.time;
        const isDone = req.body.isDone;
        const process = await this.processingService.addProcessing(userId, lessonId, time, isDone);
        return res.status(200).json({
            message: "Successful",
            data: process
        });
    }

    /**
     * API update processing course for user
     */
    updateProcessing = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const lessonId = req.body.lessonId;
        const time = req.body.time;
        const isDone = req.body.isDone;
        const process = await this.processingService.updateProcessing(userId, lessonId, time, isDone);
        return res.status(200).json({
            message: "Successful",
            data: process
        });
    }

    /**
     * API update processing course for user
     */
    getNewestProcessing = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseId = req.query.courseId;
        if (!courseId) {
            throw new BadRequestError('courseId is required');
        }
        const processing = await this.processingService.getNewestProcessing(userId, courseId.toString());
        
        return res.status(200).json({
            message: "Successful",
            data: processing
        });
    }

    recommendCourse = async (req: Request, res: Response) => {
        const data = await this.recommendSystem.test();
        return res.status(200).json({
            data
        });
    }
}
