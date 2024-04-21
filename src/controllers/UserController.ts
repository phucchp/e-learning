import { UserService } from "../services/UserService";
import { ICartService } from "../services/interfaces/ICartService";
import { IUserService } from "../services/interfaces/IUserService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { CartService } from "../services/CartService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { EnrollmentService } from "../services/EnrollmentService";
import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";

export class UserController{
	private userService: IUserService;
    private cartSerivce: ICartService;
    private enrollmentSerivce: IEnrollmentService;
    private courseSerivce: ICourseService;

	constructor() {
		this.userService = Container.get(UserService);
		this.cartSerivce = Container.get(CartService);
		this.enrollmentSerivce = Container.get(EnrollmentService);
		this.courseSerivce = Container.get(CourseService);
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
        const rowEffect = await this.cartSerivce.deleteCoursesFromCart(userId, courseIds);
        return res.status(200).json({
            message: "Successful",
            rowEffect: rowEffect
        })
    }

    addCourseToCart = async (req: Request, res: Response) => {
        const userId = 1;
        const courseId = req.body.courseId;
        await this.cartSerivce.addCourseToCart(userId, courseId);
        return res.status(202).json({
            message: "Successful",
        })
    }
    //--------------ENROLLMENT COURSE------------------//

    getEnrollmentCourses = async (req: Request, res: Response) => {
        const results = await this.enrollmentSerivce.getEnrollmentCourses(req);
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
        await this.courseSerivce.addCourseFavorite(userId, courseId);
        return res.status(200).json({
            message : "Successful",
        })
    }

    deleteCourseFavorite = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const courseId = req.body.courseId;
        await this.courseSerivce.deleteCourseFavorite(userId, courseId);
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
}
