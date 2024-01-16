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
            const courses = await this.courseService.getCourses();
            return res.status(200).json(courses);
        }catch(error: any){
            console.log(error);
            return res.status(500).json({
                message: "Server error!"
            })
        }
    }
}