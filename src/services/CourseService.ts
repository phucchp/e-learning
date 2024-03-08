import { Inject, Service } from 'typedi';
import { ICourseService } from './interfaces/ICourseService';
import { Course } from '../models/Course';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Op } from 'sequelize';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { IReviewRepository } from '../repositories/interfaces/IReviewRepository';
import { ILevelRepository } from '../repositories/interfaces/ILevelRepository';
import { LevelRepository } from '../repositories/LevelRepository';
import { S3Service } from './S3Service';
import { LessonRepository } from '../repositories/LessonRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { ILessonRepository } from '../repositories/interfaces/ILessonRepository';
import { ITopicRepository } from '../repositories/interfaces/ITopicRepository';
import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { IFavoriteRepository } from '../repositories/interfaces/IFavoriteRepository';
import { Favorite } from '../models/Favorite';
import { IoTRoboRunner } from 'aws-sdk';

@Service()
export class CourseService implements ICourseService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    @Inject(() => ReviewRepository)
	private reviewRepository!: IReviewRepository;

    @Inject(() => LevelRepository)
	private levelRepository!: ILevelRepository;

    @Inject(() => LessonRepository)
	private lessonRepository!: ILessonRepository;

    @Inject(() => TopicRepository)
	private topicRepository!: ITopicRepository;

    @Inject(() => FavoriteRepository)
	private favoriteRepository!: IFavoriteRepository;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

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

    /**
     * Update course for instructor
     * @param req 
     */
    async updateCourse(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Course> {
        const { courseId } = req.params;
        const userId = Number(req.payload.userId);
        const course = await this.getCourse(courseId);
        if(userId!==course.instructorId){
            throw new NotEnoughAuthority('Only instructors who own the course have the right to update');
        }

       // Lọc ra các trường có giá trị từ body
        const updateFields: Record<string, any> = {};
        const fieldsToUpdate = [
            'title', 'introduction', 'description', 'learnsDescription', 'requirementsDescription',
            'price', 'discount', 'categoryId', 'languageId', 'levelId'
        ];

        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        // Nếu không có trường nào cần cập nhật, trả về khóa học hiện tại mà không thay đổi
        if (Object.keys(updateFields).length === 0) {
            return course;
        }

        if(req.body.categoryId){ // check category is exist
            const category = await this.categoryRepository.findOneByCondition({
                categoryId: req.body.categoryId
            });
            if(!category){
                throw new NotFound('Category not found or deleted!');
            }
            updateFields['categoryId'] = category.id;
        }

        if(req.body.levelId){ // check level is exist
            const level = await this.levelRepository.findOneByCondition({
                id: req.body.levelId
            });
            if(!level){
                throw new NotFound('Level not found or deleted!');
            }
            updateFields['levelId'] = level.id;
        }

        if(req.body.languageId){ // check language is exist
            const language = await this.levelRepository.findOneByCondition({
                id: req.body.languageId
            });
            if(!language){
                throw new NotFound('Language not found or deleted!');
            }
            updateFields['languageId'] = language.id;
        }

        const courseUpdate = await this.courseRepository.update(course.id,updateFields);

        if(!courseUpdate){
            throw new NotFound('Course not found');
        }
        return courseUpdate;
    }

    private generateCourseId(name: string): string {
        // Chuyển tên thành viết thường và thêm dấu gạch ngang
        const lowerCaseName = name.toLowerCase();
        const dashedName = lowerCaseName.replace(/\s+/g, '-');
      
        // Tạo mã hash SHA-256 từ tên đã được xử lý
        const hash = crypto.createHash('sha256');
        const hashedCategoryId = hash.update(dashedName).digest('hex').slice(0,8);
      
        // Kết hợp tên đã xử lý và mã hash để tạo categoryId
        return `${dashedName}-${hashedCategoryId}`;
    }

    async createCourse(req: Request): Promise<Course> {
        const {title, introduction, description, learnsDescription, requirementsDescription, price, discount
            ,categoryId, languageId, levelId
        } = req.body;

        const category = await this.categoryRepository.findOneByCondition({
            categoryId: req.body.categoryId
        });
        if(!category){
            throw new NotFound('Category not found or deleted!');
        }

        const level = await this.levelRepository.findOneByCondition({
            id: req.body.levelId
        });
        if(!level){
            throw new NotFound('Level not found or deleted!');
        }

        const language = await this.levelRepository.findOneByCondition({
            id: req.body.languageId
        });
        if(!language){
            throw new NotFound('Language not found or deleted!');
        }

        const userId = Number(req.payload.userId);
        const newCourse = this.courseRepository.create({
            title: title,
            introduction: introduction,
            description: description,
            learnsDescription: learnsDescription,
            requirementsDescription: requirementsDescription,
            price: price,
            discount: discount,
            categoryId: category.id,
            languageId: languageId,
            levelId: levelId,
            instructorId: userId,
            courseId : this.generateCourseId(title),
        });

        return newCourse;
    }

    async getCourseIdByLessonId(lessonId: number): Promise<number> {
        const lesson = await this.lessonRepository.findById(lessonId);
        if(!lesson) {
            throw new NotFound('lesson not found');
        }

        const topic = await this.topicRepository.findById(lesson.topicId);
        if(!topic) {
            throw new ServerError('Server error: Can not find topic of lesson');
        }

        return topic.courseId;
    }

    async getCourseByLessonId(lessonId: number): Promise<Course> {
        const lesson = await this.lessonRepository.findById(lessonId);
        if(!lesson) {
            throw new NotFound('lesson not found');
        }

        const topic = await this.topicRepository.findById(lesson.topicId);
        if(!topic) {
            throw new ServerError('Server error: Can not find topic of lesson');
        }

        const course = await this.courseRepository.findById(topic.courseId);
        if(!course) {
            throw new NotFound('Course not found');
        }
        return course;
    }

    /**
     * Check the user's favorite course.
     * 
     * @param courseId 
     * @param userId 
     * @returns 
     */
    async isCourseFavorite(courseId: number, userId: number): Promise<boolean> {
        const favorite = await this.favoriteRepository.findOneByCondition({
            courseId: courseId,
            userId: userId
        }, true);
        if(!favorite){
            return false;
        }
        return true;
    }

    async addCourseFavorite(courseId: string, userId: number): Promise<boolean> {
        const course  = await this.courseRepository.findOneByCondition({
            courseId: courseId,
            active: true
        });
        // Check course is exist
        if(!course){
            throw new NotFound('Course not found or is not actived');
        }

        if(await this.isCourseFavorite(course.id, userId)){
            // Return error if user already favorited course
            throw new DuplicateError('The user already favorited the course before.');
        }

        await this.favoriteRepository.create({
            courseId: course.id,
            userId: userId
        });

        return true;
    }

    async deleteCourseFavorite(courseId: string, userId: number): Promise<boolean> {
        const course  = await this.courseRepository.findOneByCondition({
            courseId: courseId,
            active: true
        });
        // Check course is exist
        if(!course){
            throw new NotFound('Course not found or is not actived');
        }
        const favorite = await this.favoriteRepository.findOneByCondition({
            courseId: course.id,
            userId: userId
        }, true);

        if(!favorite){
            // Return error if user is not favorited course
            throw new NotFound('The user is not favorited the course before.');
        }
        
        await this.favoriteRepository.deleteInstace(favorite);
        return true;
    }

    async getCoursesFavorite(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<{ rows: Favorite[]; count: number; }> {
        throw Error("Method not implemented");
    }
}
