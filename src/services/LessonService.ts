import { Inject, Service } from 'typedi';
import { ILessonService } from './interfaces/ILessonService';
import { Lesson } from '../models/Lesson';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { LessonRepository } from '../repositories/LessonRepository';
import { ILessonRepository } from '../repositories/interfaces/ILessonRepository';
import { Course } from '../models/Course';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';
import { S3Service } from './S3Service';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';

@Service()
export class LessonService implements ILessonService {

    @Inject(() => LessonRepository)
	private lessonRepository!: ILessonRepository;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    /**
     * Get lesson details
     * @param lessonId 
     * @param userId 
     * @returns 
     */
    async getLesson(lessonId: number): Promise<Lesson> {
       const lesson = await this.lessonRepository.getLessonDetails(lessonId);
       if(!lesson) {
        throw new NotFound("Lesson Not Found");
       }
       const lessonUrl = lesson.lessonUrl || 'lessons/defaults/video.mp4'
       lesson.lessonUrl = await this.s3Service.getObjectUrl(lessonUrl);
       for(const comment of lesson.comments) {
            comment.user.profile.avatar = await this.s3Service.getObjectUrl(comment.user.profile.avatar || 'users/defaults/avatar.jpg');
       }
       return lesson;
    }   

    async updateTotalLessonsOfCourse(courseId: number) {
        const course = await this.courseRepository.findById(courseId);
        if (course) {
            // Get all topics of the course
            // Find all lesson including topics
        }
    }

    async createLessons(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Lesson[]> {
        // Check role user is instructor and owner this course
        const lessons = req.body.lessons;
        const userId = Number(req.payload.userId);
        const topicIds = new Set(lessons.map((lesson: { topicId: number; }) => lesson.topicId));
        topicIds.forEach(async topicId => {
            const course = await this.courseService.getCourseByTopicId(Number(topicId));
            if(course.instructorId !== userId) {
                throw new NotEnoughAuthority('Not Enough Authority!');
            }
        });

        const newLessons = await this.lessonRepository.createLessons(lessons);
        // Update totalLessons of course
        const firstTopicId = [...topicIds][0];
        const course = await this.courseService.getCourseByTopicId(Number(firstTopicId));
        course.totalLessons = course.totalLessons + 1;
        await this.courseRepository.updateInstance(course);
        return newLessons;
    }

    async updateLesson(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Lesson> {
        // Check role user is instructor and owner this course
        // title, duration, isPreview, topicId
        const lessonId = Number(req.params.lessonId);
        const userId = Number(req.payload.userId);
        const {title, isPreview, duration} = req.body;
        const lesson = await this.lessonRepository.findOneByCondition({
            id: lessonId,
        });
        if(!lesson) {
            throw new NotFound("Lesson not found!");
        }
        const course = await this.courseService.getCourseByLessonId(lessonId);
        if(course.instructorId !== userId) {
            throw new NotEnoughAuthority('Not Enough Authority!');
        }
        if(title) {
            lesson.title = title;
        }
        if(isPreview) {
            lesson.isPreview = isPreview;
        }
        if(duration) {
            lesson.duration = duration;
        }
        const newLesson =  await this.lessonRepository.updateInstance(lesson);
        if(!newLesson) {
            throw new ServerError('Server error: Cannot update lesson !');
        }
        return newLesson;
    }   

    async deleteLesson(lessonId: number): Promise<void> {
        await this.lessonRepository.delete(lessonId, true);
        // Update total lesson of course
        const course = await this.courseService.getCourseByLessonId(lessonId);
        if(course.totalLessons > 0) {
            course.totalLessons = course.totalLessons - 1;
        }
    }

    async getLinkUpdateVideoLesson(lessonId: number): Promise<string> {
        const lesson = await this.lessonRepository.findOneByCondition({
            id: lessonId,
        });

        if(!lesson) {
            throw new NotFound("Lesson not found!");
        }

        if(!lesson.lessonUrl) {
            lesson.lessonUrl = `lessons/${lesson.id}/video.mp4`;
            await this.lessonRepository.updateInstance(lesson);
        }

        return await this.s3Service.generatePresignedUrlUpdate(lesson.lessonUrl, 'video/mp4');
    }
}