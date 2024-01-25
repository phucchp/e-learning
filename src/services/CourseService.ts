import { Inject, Service } from 'typedi';
import { ICourseService } from './interfaces/ICourseService';
import { Course } from '../models/Course';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Op } from 'sequelize';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { IReviewRepository } from '../repositories/interfaces/IReviewRepository';

@Service()
export class CourseService implements ICourseService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    @Inject(() => ReviewRepository)
	private reviewRepository!: IReviewRepository;

    private VIDEO_DURATION_EXTRA_SHORT = 1;
    private VIDEO_DURATION_SHORT = 3;
    private VIDEO_DURATION_MEDIUM = 6;
    private VIDEO_DURATION_LONG = 17;

    scopeFilterByDuration(durations:any):any{
        const where: any = {};
        where[Op.or] = [];
        if(durations.includes('extraShort')){
            where[Op.or].push({
                duration: {
                    [Op.lte]: this.VIDEO_DURATION_EXTRA_SHORT
                }
            });
        }

        if(durations.includes('short')){
            where[Op.or].push({
                [Op.and]: [
                    { duration: { [Op.gt]: this.VIDEO_DURATION_EXTRA_SHORT } },
                    { duration: { [Op.lte]: this.VIDEO_DURATION_SHORT } }
                ]
            });
        }

        if(durations.includes('medium')){
            where[Op.or].push({
                [Op.and]: [
                    { duration: { [Op.gt]: this.VIDEO_DURATION_SHORT } },
                    { duration: { [Op.lte]: this.VIDEO_DURATION_MEDIUM } }
                ]
            });
        }

        if(durations.includes('long')){
            where[Op.or].push({
                [Op.and]: [
                    { duration: { [Op.gt]: this.VIDEO_DURATION_MEDIUM } },
                    { duration: { [Op.lte]: this.VIDEO_DURATION_LONG } }
                ]
            });
        }

        if(durations.includes('extraLong')){
            where[Op.or].push({
                duration: {
                    [Op.gt]: this.VIDEO_DURATION_LONG
                }
            });
        }
        return where;
    }

    async getCourses(req: Request): Promise<{ rows: Course[]; count: number}> {
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
            whereCondition[Op.and] = this.scopeFilterByDuration(duration);
        }

        if(price){
            if(price === 'free'){
                whereCondition['price'] = {[Op.eq]: 0};
            }else if(price==='paid'){
                whereCondition['price'] = {[Op.gt]: 0};
            }
        }

        const options = {
            page: page || 1,
            pageSize: pageSize || 10,
            whereCondition: whereCondition,
            sortType: sortType || 'ASC',
            sort : sort || 'createdAt'
        }
        const courses = await this.courseRepository.getCourses(options);
        return courses;
    }

    async getCourse(courseId: string): Promise<Course> {
        const course = await this.courseRepository.getCourse(courseId);
        if(!course){
            throw new NotFound('Course not found');
        }
        return course;
    }

}