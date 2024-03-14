import { LessonService } from "../services/LessonService";
import { ILessonService } from "../services/interfaces/ILessonService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { EnrollmentService } from "../services/EnrollmentService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { NotEnoughAuthority } from "../utils/CustomError";
import { IUserService } from "../services/interfaces/IUserService";
import { UserService } from "../services/UserService";
import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";

export class LessonController{
	private lessonService: ILessonService;
	private enrollmentService: IEnrollmentService;
	private userService: IUserService;
	private courseService: ICourseService;

	constructor() {
		this.lessonService = Container.get(LessonService);
		this.enrollmentService = Container.get(EnrollmentService);
		this.userService = Container.get(UserService);
		this.courseService = Container.get(CourseService);
	}

    getLesson = async (req: Request, res: Response) => {
        // const userId = req.payload.userId;
        const userId=1;
        const lessonId = Number(req.params.lessonId);
        // Get lesson
        const lesson = await this.lessonService.getLesson(lessonId, userId);

        // Return lesson if it allow preview
        if(lesson.isPreview) {
            return res.status(200).json({
                message: "Successfull",
                data: lesson
            });
        }

        // Check user is enrollment course
        const course = await this.courseService.getCourseByLessonId(lessonId);
        if(
            !await this.enrollmentService.isUserEnrollmentCourse(userId, lessonId) // User is not enrollment course
            && !await this.userService.isAdmin(userId) // User is not admin
            && course.instructorId !== userId // User is not instructor owner this course
        ){
            throw new NotEnoughAuthority('User is not enrollment course!');
        }

        return res.status(200).json({
            message: "Successfull",
            data: lesson
        });
    }

}