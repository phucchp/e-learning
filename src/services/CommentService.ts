import { Inject, Service } from 'typedi';
import { ICommentService } from './interfaces/ICommentService';
import { Comment } from '../models/Comment';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CommentRepository } from '../repositories/CommentRepository';
import { ICommentRepository } from '../repositories/interfaces/ICommentRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { ILessonRepository } from '../repositories/interfaces/ILessonRepository';

@Service()
export class CommentService implements ICommentService {

    @Inject(() => CommentRepository)
	private commentRepository!: ICommentRepository;

    @Inject(() => LessonRepository)
	private lessonRepository!: ILessonRepository;

    async createComment(userId: number, lessonId: number, content: string): Promise<Comment> {
        // Check lessonId is exists
        const lesson = await this.lessonRepository.findById(lessonId);
        if(!lesson) {
            throw new NotFound('Lesson not found!');
        }
        return await this.commentRepository.create({
            lessonId: lessonId,
            userId: userId,
            content: content
        });
    }

    async updateComment(commentId: number, userId: number, content: string): Promise<Comment> {
        const comment = await this.commentRepository.findById(commentId, true);
        if(!comment || comment.deletedAt === null) {
            // check comment id is exists
            throw new NotFound('Comment not found or deleted!');
        }
        if(comment.userId !== userId) {
            // check comment is owner by user
            throw new NotEnoughAuthority('User is not owner comment');
        }
        // Update content comment
        comment.content =content;
        const newComment = await this.commentRepository.updateInstace(comment);
        if(!newComment) {
            throw new NotFound('Can not update comment!');
        }

        return newComment;
    }

    async deleteComment(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findById(commentId, true);
        if(!comment || comment.deletedAt === null) {
            // check comment id is exists
            throw new NotFound('Comment not found or deleted!');
        }
        if(comment.userId !== userId) {
            // check comment is owner by user
            throw new NotEnoughAuthority('User is not owner comment');
        }
        await this.commentRepository.deleteInstace(comment);
    }

}