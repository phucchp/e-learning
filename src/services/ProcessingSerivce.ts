import { Inject, Service } from 'typedi';
import { IProcessingService } from './interfaces/IProcessingService';
import { Processing } from '../models/Processing';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { ProcessingRepository } from '../repositories/ProcessingRepository';
import { IProcessingRepository } from '../repositories/interfaces/IProcessingRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { ILessonRepository } from '../repositories/interfaces/ILessonRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { ITopicRepository } from '../repositories/interfaces/ITopicRepository';
import { EnrollmentService } from './EnrollmentService';
import { IEnrollmentService } from './interfaces/IEnrollmentService';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';

@Service()
export class ProcessingService implements IProcessingService {
    
    @Inject(() => ProcessingRepository)
	private processingRepository!: IProcessingRepository;

    @Inject(() => EnrollmentService)
	private enrollmentService!: IEnrollmentService;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    async addProcessing(userId: number, lessonId: number): Promise<Processing> {
        // check user is enrolled course
        const courseId = await this.courseService.getCourseIdByLessonId(lessonId);

        if(await this.enrollmentService.isUserEnrollmentCourse(userId, courseId)){
            throw new NotEnoughAuthority('The user has not yet enrolled in the course!');
        }

        return await this.processingRepository.create({
            userId: userId,
            lessonId: lessonId
        });
    }
    async getNewestProcessing(userId: number, courseId: number): Promise<Processing> {
        // get theo ngay tao moi nhat
        
        throw new Error('Method not implemented.');
    }

}