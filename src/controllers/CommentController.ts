import { CommentService } from "../services/CommentService";
import { ICommentService } from "../services/interfaces/ICommentService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import { EnrollmentService } from "../services/EnrollmentService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { NotEnoughAuthority } from "../utils/CustomError";

export class CommentController{
	private commentService: ICommentService;
	private courseService: ICourseService;
	private enrollmentService: IEnrollmentService;

	constructor() {
		this.commentService = Container.get(CommentService);
		this.courseService = Container.get(CourseService);
		this.enrollmentService = Container.get(EnrollmentService);
	}

    createComment = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const {lessonId, parentId, content} = req.body;
        // Check user is enrolled course
        const course = await this.courseService.getCourseByLessonId(lessonId);
        if (!await this.enrollmentService.isUserEnrollmentCourse(userId, course.id)) {
            throw new NotEnoughAuthority('User is not enrolled course, can not comment!');
        }
        const comment = await this.commentService.createComment(userId, lessonId, parentId, content);
        return res.status(200).json({
            message: "successfully",
            data: comment,
        });
    }

    updateComment = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const {content} = req.body;
        const commentId = Number(req.params.commentId);
        const comment = await this.commentService.updateComment(commentId, userId, content);
        return res.status(200).json({
            message: "successfully",
            data: comment,
        });
    }

    deleteComment = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const commentId = Number(req.params.commentId);
        const comment = await this.commentService.deleteComment(commentId, userId);
        return res.status(200).json({
            message: "successfully",
            data: comment,
        });
    }

}