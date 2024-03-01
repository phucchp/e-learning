import { UserService } from "../services/UserService";
import { ICartService } from "../services/interfaces/ICartService";
import { IUserService } from "../services/interfaces/IUserService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { CartService } from "../services/CartService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { EnrollmentService } from "../services/EnrollmentService";

export class UserController{
	private userService: IUserService;
    private cartSerivce: ICartService;
    private enrollmentSerivce: IEnrollmentService;

	constructor() {
		this.userService = Container.get(UserService);
		this.cartSerivce = Container.get(CartService);
		this.enrollmentSerivce = Container.get(EnrollmentService);
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

}
