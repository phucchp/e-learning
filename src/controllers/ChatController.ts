import Container from 'typedi';
import { Request, Response } from 'express';
import { NotEnoughAuthority, UnauthorizedError } from "../utils/CustomError";
import { ChatService } from '../services/ChatService';
import { CourseService } from '../services/CourseService';
import { ICourseService } from '../services/interfaces/ICourseService';
import { EnrollmentService } from '../services/EnrollmentService';
import { UserService } from '../services/UserService';
import { IEnrollmentService } from '../services/interfaces/IEnrollmentService';
import { IUserService } from '../services/interfaces/IUserService';

export class ChatController{
	private chatService: ChatService;
	private courseService: ICourseService;
	private enrollmentService: IEnrollmentService;
	private userService: IUserService;

	constructor() {
		this.chatService = Container.get(ChatService);
		this.courseService = Container.get(CourseService);
		this.userService = Container.get(UserService);
		this.enrollmentService = Container.get(EnrollmentService);
	}

    chat = async (req: Request, res: Response) => {
        // const userId = Number(req.payload.userId);
        // const courseId = req.body.courseId;
        // const course = await this.courseService.getCourse(courseId);
        // if(course.instructorId !== userId 
        //     && !await this.userService.isAdmin(userId)
        //     && !await this.enrollmentService.isUserEnrollmentCourse(userId, course.id) // User is not enrollment course
        // ){
        //     throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        // }
        const response = await this.chatService.chat(req);
        return res.status(200).json({
            "message": "Success",
            "response": response
        });
    }
}
