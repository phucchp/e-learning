import { Inject, Service } from 'typedi';
import { IEnrollmentService } from './interfaces/IEnrollmentService';
import { Enrollment } from '../models/Enrollment';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { BadRequestError, ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';
import { Op } from 'sequelize';
import { CourseService } from './CourseService';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';

@Service()
export class EnrollmentService implements IEnrollmentService {
    
    @Inject(() => EnrollmentRepository)
	private enrollmentRepository!: IEnrollmentRepository;

    @Inject(() => CourseService)
	private crouseService!: CourseService;

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    async getEnrollmentCourses(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<{ rows: Enrollment[]; count: number; }> {
        const userId = req.payload.userId;
        let { search, category, averageRating, languageId, level, duration,sort, sortType ,price, page, pageSize} = req.query;
        const whereCondition: any = {};
        if(search){
            whereCondition[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { learnsDescription: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if(category){
            const categoryDb = await this.categoryRepository.findOneByCondition({categoryId: category});
            if(!categoryDb){
                throw new NotFound('Category Not Found!');
            }
            whereCondition['categoryId'] = categoryDb.id;
        }

        if(averageRating){
            whereCondition['averageRating'] = {[Op.gt]: averageRating};
        }

        if(languageId){
            whereCondition['languageId'] = {[Op.eq]: languageId};
        }

        if(level){
            whereCondition['levelId'] = {[Op.eq]: level};
        }

        if(duration){
            whereCondition[Op.and] = this.crouseService.scopeFilterByDuration(duration);
        }

        const options = {
            page: page || 1,
            pageSize: pageSize || 10,
            whereCondition: whereCondition,
            sortType: sortType || 'ASC',
            sort : sort || 'createdAt'
        }
        return await this.enrollmentRepository.getEnrollmentCourses(userId, options);
    }

    /**
     * Check user is enrollment course
     */
    async isUserEnrollmentCourse(userId: number, courseId: number): Promise<boolean>{
        const enrollment = await this.enrollmentRepository.findOneByCondition({
            userId: userId,
            courseId: courseId
        },[], false);
        if(enrollment) return true;
        return false;
    }

    async addEnrollmentCourse(userId: number, courseId: number): Promise<Enrollment> {
        if(await this.isUserEnrollmentCourse(userId, courseId)){
            // Return error if user already enrollment course
            throw new BadRequestError('User already enrollment course!');
        }

        return await this.enrollmentRepository.create({
            userId:userId,
            courseId:courseId
        });
    }

    async addEnrollmentCourseInBulk(userId: number, courseIds: number[]): Promise<Enrollment[]> {
        const userCourses = courseIds.map(courseId => ({ userId, courseId }));
        return await this.enrollmentRepository.createMultiple(userCourses);
    }
}