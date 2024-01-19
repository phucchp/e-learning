import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { handleErrorController } from "../utils/CustomError";

export class CourseController{
	private courseService: ICourseService;

	constructor() {
		this.courseService = Container.get(CourseService);
	}

    getCourses = async (req: Request, res: Response) => {
        try{
            const courses = await this.courseService.getCourses(req);
            return res.status(200).json(courses);
        }catch(error: any){
            handleErrorController(error, res);
        }
    }

    getCourse = async (req: Request, res: Response) => {
        try{
            const courseId = req.params.courseId;
            const course = await this.courseService.getCourse(courseId);
            return res.status(200).json({
                message: "successfully",
                data: course
            });
        }catch(error: any){
            handleErrorController(error, res);
        }
    }
}