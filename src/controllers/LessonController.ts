import { LessonService } from "../services/LessonService";
import { ILessonService } from "../services/interfaces/ILessonService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { EnrollmentService } from "../services/EnrollmentService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { NotEnoughAuthority } from "../utils/CustomError";

export class LessonController{
	private lessonService: ILessonService;
	private enrollmentService: IEnrollmentService;

	constructor() {
		this.lessonService = Container.get(LessonService);
		this.enrollmentService = Container.get(EnrollmentService);
	}

    getLesson = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const lessonId = Number(req.body.lessonId);
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
        if(!await this.enrollmentService.isUserEnrollmentCourse(userId, lessonId)){
            throw new NotEnoughAuthority('User is not enrollment course');
        }

        return res.status(200).json({
            message: "Successfull",
            data: lesson
        });
    }

}