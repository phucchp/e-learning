import { CommentService } from "../services/CommentService";
import { ICommentService } from "../services/interfaces/ICommentService";
import Container from 'typedi';
import { Request, Response } from 'express';

export class CommentController{
	private commentService: ICommentService;

	constructor() {
		this.commentService = Container.get(CommentService);
	}

    createComment = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const {lessonId, content} = req.body;
        const comment = await this.commentService.createComment(userId, lessonId, content);
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