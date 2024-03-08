import { Inject, Service } from 'typedi';
import { ILessonService } from './interfaces/ILessonService';
import { Lesson } from '../models/Lesson';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { LessonRepository } from '../repositories/LessonRepository';
import { ILessonRepository } from '../repositories/interfaces/ILessonRepository';
import { Course } from '../models/Course';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';
import { S3Service } from './S3Service';

@Service()
export class LessonService implements ILessonService {

    @Inject(() => LessonRepository)
	private lessonRepository!: ILessonRepository;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    /**
     * Get lesson details
     * @param lessonId 
     * @param userId 
     * @returns 
     */
    async getLesson(lessonId: number, userId: number): Promise<Lesson> {
       const lesson = await this.lessonRepository.getLessonDetails(lessonId, userId);
       if(!lesson) {
        throw new NotFound("Lesson Not Found");
       }
       lesson.lessonUrl = await this.s3Service.getObjectUrl(lesson.lessonUrl);
       return lesson;
    }   

    async createLesson(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Lesson> {
        // Check role user is instructor and owner this course
        throw new Error('Method not implemented.');
    }


    async createMultipleLesson(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Lesson> {
        // Check role user is instructor and owner this course
        throw new Error('Method not implemented.');
    }


    async updateLesson(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Lesson> {
        // Check role user is instructor and owner this course
        throw new Error('Method not implemented.');
    }   

    async deleteLesson(lessonId: string): Promise<void> {
        // Check role user is instructor and owner this course or user is admin
        throw new Error('Method not implemented.');
    }
}