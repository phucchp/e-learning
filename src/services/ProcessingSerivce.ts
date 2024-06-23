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
import { EnrollmentService } from './EnrollmentService';
import { IEnrollmentService } from './interfaces/IEnrollmentService';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';
import { Op } from 'sequelize';

@Service()
export class ProcessingService implements IProcessingService {
    
    @Inject(() => ProcessingRepository)
	private processingRepository!: IProcessingRepository;

    @Inject(() => EnrollmentService)
	private enrollmentService!: IEnrollmentService;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    async addProcessing(userId: number, lessonId: number, time: number, isDone: boolean): Promise<Processing> {
        // check user is enrolled course
        const courseId = await this.courseService.getCourseIdByLessonId(lessonId);

        if(!await this.enrollmentService.isUserEnrollmentCourse(userId, courseId)){
            throw new NotEnoughAuthority('The user has not yet enrolled in the course!');
        }

        return await this.processingRepository.create({
            userId: userId,
            lessonId: lessonId,
            time: time,
            isDone: isDone
        });
    }

    async updateProcessing(userId: number, lessonId: number, time: number, isDone: boolean): Promise<Processing> {
        // check user is enrolled course
        const courseId = await this.courseService.getCourseIdByLessonId(lessonId);

        if(await this.enrollmentService.isUserEnrollmentCourse(userId, courseId)){
            throw new NotEnoughAuthority('The user has not yet enrolled in the course!');
        }

        const processing = await this.processingRepository.findOneByCondition({
            userId: userId,
            lessonId: lessonId
        });

        if(!processing) {
            throw new NotFound('Not found!');
        }
        processing.time = time;
        processing.isDone = isDone;

        const newProcessing = await this.processingRepository.updateInstance(processing);
        if(!newProcessing) {
            throw new ServerError('Error updating processing');
        }
        return newProcessing;
    }

    async percentageCompletedCourse(userId: number, courseId: string): Promise<number> {
        // Lấy tổng số bài đã tích / tổng số bài học của khoá học * 100
        // Get tổng số bài học của khoá học
        // Get tổng số bài đã tích -> get list enrollment where isDone = true and ... (Get các lesson của course trc)
        const course = await this.courseService.getCourse(courseId);
        const totalLessons = course.totalLessons;
        //
        return 100;
    }

    /**
     * Get newest processing of user
     * @param userId 
     * @param courseId 
     */
    async getNewestProcessing(userId: number, courseId: string): Promise<Processing|null> {
        // get theo ngay update moi nhat
        // Để khi user bấm vào khoá học thì sẽ tiếp tục học từ bài trước
        const lessonIds = await this.courseService.getLessonIdsOfCourse(courseId);
        const processing = await this.processingRepository.getAll({
            where: {
                userId: userId,
                lessonId: {
					[Op.in]:lessonIds
				},
                isDone: true,
            },
            order: [
                ['updatedAt', 'DESC']
            ]
        });

        if (processing.length === 0) {
            return null
        }

        return processing[0];
    }

}