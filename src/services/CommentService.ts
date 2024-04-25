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
import { IUserService } from './interfaces/IUserService';
import { UserService } from './UserService';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';

@Service()
export class CommentService implements ICommentService {

    @Inject(() => CommentRepository)
	private commentRepository!: ICommentRepository;

    @Inject(() => LessonRepository)
	private lessonRepository!: ILessonRepository;

    @Inject(() => UserService)
	private userService!: IUserService;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

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
        const newComment = await this.commentRepository.updateInstance(comment);
        if(!newComment) {
            throw new NotFound('Can not update comment!');
        }

        return newComment;
    }

    async deleteComment(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findById(commentId, true);
        if (!comment || comment.deletedAt === null) {
            // check comment id is exists
            throw new NotFound('Comment not found or deleted!');
        }

        // Check user is instructor and owner this course
        if ( await this.userService.isInstructor(userId)) {
            const courseId = await this.courseService.getCourseIdByLessonId(comment.lessonId);
            if ( await this.courseService.isUserOwnerCourse(courseId, userId)) {
                // Delete and return
                return await this.commentRepository.deleteInstance(comment);
            }
        }

        if ( await this.userService.isAdmin(userId)) {
            // Delete and return
            return await this.commentRepository.deleteInstance(comment);
        }

        if (comment.userId !== userId) {
            // check comment is owner by user
            throw new NotEnoughAuthority('User is not owner comment or user is not administrator');
        }
        
        return await this.commentRepository.deleteInstance(comment);
    }

}