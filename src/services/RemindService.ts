import { Inject, Service } from 'typedi';
import { IRemindService } from './interfaces/IRemindService';
import { Remind } from '../models/Remind';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { RemindRepository } from '../repositories/RemindRepository';
import { IRemindRepository } from '../repositories/interfaces/IRemindRepository';
import { EnrollmentService } from './EnrollmentService';
import { IEnrollmentService } from './interfaces/IEnrollmentService';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';

@Service()
export class RemindService implements IRemindService {

    @Inject(() => RemindRepository)
	private remindRepository!: IRemindRepository;

    @Inject(() => EnrollmentService)
	private enrollmentService!: IEnrollmentService;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    async getReminds(): Promise<Remind[]> {
        throw new Error('Method not implemented.');
    }
    
    async addRemind(userId: number, lessonId: number, time: string): Promise<Remind> {
        const remind = await this.remindRepository.findOneByCondition({
            userId: userId,
            lessonId: lessonId
        });

        if(remind){
            // If reminder is already exists, update the reminder
            await this.updateRemind(userId, lessonId, time);
        }

        const courseId = await this.courseService.getCourseIdByLessonId(lessonId);
        // Check user enrollments course
        if (!await this.enrollmentService.isUserEnrollmentCourse(userId, courseId)) {
            throw new NotEnoughAuthority('User is not enrollment course, can not add remind!');
        }

        return await this.remindRepository.create({
            userId: userId,
            lessonId: lessonId,
            time: time,
            isRemind: false
        });
    }
    
    async deleteRemind(userId: number, lessonId: number): Promise<void> {
        const remind = await this.remindRepository.findOneByCondition({
            userId: userId,
            lessonId: lessonId
        });

        if (!remind) {
            throw new NotFound("Remind not found!");
        }

        if(remind.userId !== userId){
            throw new NotEnoughAuthority('Forbidden, remind are not owned by the user');
        }

        await this.remindRepository.delete(remind.id, true);
    }
    
    async updateRemind(userId: number, lessonId: number, time: string): Promise<Remind> {
        const remind = await this.remindRepository.findOneByCondition({
            userId: userId,
            lessonId: lessonId
        });

        if (!remind) {
            throw new NotFound("Remind not found!");
        }

        remind.time = time;
        const newRemind = await this.remindRepository.updateInstance(remind);
        if (!newRemind) {
            throw new ServerError("Server error, error while updating remind!");
        }
        return newRemind;
    }
}