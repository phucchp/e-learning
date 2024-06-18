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
import { HandleS3 } from './utils/HandleS3';
import { RecommenderSystem } from './RecommenderSystem';
import { CollaborativeFiltering } from './CollaborativeFiltering';
import { TagRepository } from '../repositories/TagRepository';
import { ITagRepository } from '../repositories/interfaces/ITagRepository';
import { CourseTag } from '../models/CourseTag';
import { CourseTagRepository } from '../repositories/CourseTagRepository';
import { ICourseTagRepository } from '../repositories/interfaces/ICourseTagRepository';
import { ContentBasedRecommendSystem } from './ContentBasedRecommendSystem';
import { RedisService } from './RedisService';

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

    @Inject(() => RecommenderSystem)
	private recommendSystem!: RecommenderSystem;

    @Inject(() => ContentBasedRecommendSystem)
	private contentBasedRecommendSystem!: ContentBasedRecommendSystem;

    @Inject(() => TagRepository)
	private tagRepository!: ITagRepository;

    @Inject(() => CourseTagRepository)
	private courseTagRepository!: ICourseTagRepository;

    @Inject(() => HandleS3)
	private handleS3!: HandleS3;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    @Inject(() => RedisService)
	private redisService!: RedisService;

    @Inject(() => CollaborativeFiltering)
	private collaborativeFiltering!: CollaborativeFiltering;

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
        let { search, category, averageRating, languageId, instructorId, level, duration,sort, sortType ,price, page, pageSize} = req.query;
        const whereCondition: any = {};
        if(search){
            whereCondition[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                // { description: { [Op.iLike]: `%${search}%` } },
                // { learnsDescription: { [Op.iLike]: `%${search}%` } },
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

        if(instructorId){
            whereCondition['instructorId'] = {[Op.eq]: instructorId};
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
        let courses = await this.courseRepository.getCourses(options);
        courses.rows = await this.handleS3.getResourceCourses(courses.rows);
        return courses;
    }

    /**
     * For instructor
     * @param req 
     * @returns 
     */
    async getAllCourseOfInstructors(req: Request ): Promise<{ rows: Course[]; count: number}> {
        let { search, category, averageRating, languageId, level, duration,sort, sortType ,price, page, pageSize} = req.query;
        const instructorId = req.payload.userId;
        const whereCondition: any = {};
        if(search){
            whereCondition[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                // { description: { [Op.iLike]: `%${search}%` } },
                // { learnsDescription: { [Op.iLike]: `%${search}%` } },
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

        if(instructorId){
            whereCondition['instructorId'] = {[Op.eq]: instructorId};
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
        let courses = await this.courseRepository.getCourses(options);
        courses.rows = await this.handleS3.getResourceCourses(courses.rows);
        return courses;
    } 

    /**
     * For user
     * @param req 
     * @returns 
     */
    async getAllCourseOfInstructorsForUser(req: Request, instructorId: number ): Promise<{ rows: Course[]; count: number}> {
        let { search, category, averageRating, languageId, level, duration,sort, sortType ,price, page, pageSize} = req.query;
        const whereCondition: any = {};
        if(search){
            whereCondition[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                // { description: { [Op.iLike]: `%${search}%` } },
                // { learnsDescription: { [Op.iLike]: `%${search}%` } },
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

        if(instructorId){
            whereCondition['instructorId'] = {[Op.eq]: instructorId};
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
        let courses = await this.courseRepository.getCourses(options);
        courses.rows = await this.handleS3.getResourceCourses(courses.rows);
        return courses;
    }

    async getCourse(courseId: string): Promise<Course> {
        const cacheKey = `courses:${courseId}`;
        const cachedResult = await this.redisService.getCache(cacheKey);
        if (cachedResult) {
            // If cached data is available, return it
            return cachedResult;
        }
        let course = await this.courseRepository.getCourse(courseId);
        if(!course){
            throw new NotFound('Course not found');
        }
        // Get resource S3 for course
        course = await this.handleS3.getResourceCourse(course);
        // Get link avatar instructor of course
        if (course.getDataValue('instructor')) {
            const profile = course.getDataValue('instructor').getDataValue('profile');
            if (profile) {
                course.instructor.setDataValue('profile', await this.handleS3.getAvatarUser(profile));
            }
        }
        // Get link avatar user review course
        if (course.getDataValue('reviews')) {
            for(const review of course.reviews) {
                if (review.getDataValue('user').getDataValue('profile')) {
                    review.user.setDataValue('profile', await this.handleS3.getAvatarUser(review.user.profile));
                }
            }
        }
        //Save course to cache
		await this.redisService.setCache(cacheKey, course, 60 * 5);
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
        const cacheKey = `courses:${courseId}`;
        await this.redisService.clearCacheByKey(cacheKey);
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
        const newCourse = await this.courseRepository.create({
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

    async getCourseByTopicId(topicId: number): Promise<Course> {

        const topic = await this.topicRepository.findById(topicId);
        if(!topic) {
            throw new NotFound('Topic not found!');
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
        },[], true);
        if(!favorite){
            return false;
        }
        return true;
    }

    /**
     * Check the user's favorite course.
     * 
     * @param courseId 
     * @param userId 
     * @returns 
     */
    async isUserOwnerCourse(courseId: number, userId: number): Promise<boolean> {
        const course = await this.courseRepository.findOneByCondition({
            id: courseId,
            instructorId: userId
        });
        if(!course){
            return false;
        }
        return true;
    }

    async addCourseFavorite(courseId: string, userId: number): Promise<boolean> {
        const course  = await this.courseRepository.findOneByCondition({
            courseId: courseId,
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
        });
        // Check course is exist
        if(!course){
            throw new NotFound('Course not found or is not actived');
        }
        const favorite = await this.favoriteRepository.findOneByCondition({
            courseId: course.id,
            userId: userId
        });

        if(!favorite){
            // Return error if user is not favorited course
            throw new NotFound('The user is not favorited the course before.');
        }
        
        await this.favoriteRepository.deleteInstance(favorite, true);
        return true;
    }

    async getCoursesFavorite(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<{ rows: Favorite[]; count: number; }> {
        throw Error("Method not implemented");
    }

    /**
     * Using create data for payment with paypal
     * @param courseIds 
     * @returns 
     */
    async createDataCourseForPayment(courseIds: string[]): Promise<{totalPrice: number; items: any[]}> {
        const items = [];
        let totalPrice = 0;
        const courses = await this.courseRepository.getAll({
            where: {
                courseId: {
					[Op.in]:courseIds
				}
            }
        });

        for(const course of courses) {
            const price = course.price - course.price * course.discount/100;
            totalPrice += parseFloat(price.toFixed(2));
            items.push({
                name : course.id.toString(),
                quantity: '1',
                unit_amount: {
                    currency_code: "USD",
                    value: price.toFixed(2),
                }
            });
        }

        return {
            totalPrice: totalPrice,
            items: items
        };
    }

    /**
     * Get list courses by courseIds
     * @param courseIds 
     * @returns 
     */
    async getCoursesByCourseIds(courseIds: number[]): Promise<Course[]> {
        return await this.courseRepository.getAll({
            where: {
                id: {
					[Op.in]:courseIds
				}
            }
        });
    }

    /**
     * Get list lessonIds of Course
     * @param courseId 
     * @returns 
     */
    async getLessonIdsOfCourse(courseId: string): Promise<number[]> {
        const course = await this.courseRepository.getAllLessonOfCourse(courseId);
        const lessonIds: number[] = [];
        for (const topic of course.topics) {
            for(const lesson of topic.lessons) {
                lessonIds.push(lesson.id);
            }
        }

        return lessonIds;
    }

    async getPresignedUrlToUploadPoster(courseId: string): Promise<string> {
        const course = await this.courseRepository.getCourse(courseId);
        if(!course){
            throw new NotFound('Course not found');
        }

        if(!course.posterUrl) {
            course.posterUrl = `courses/${course.id}/poster.jpg`;
            await this.courseRepository.updateInstance(course);
        }


        return await this,this.s3Service.generatePresignedUrlUpdate(course.posterUrl, 'image/jpeg');
    }

    async getPresignedUrlToUploadTrailer(courseId: string): Promise<string> {
        const course = await this.courseRepository.getCourse(courseId);
        if(!course){
            throw new NotFound('Course not found');
        }

        if(!course.trailerUrl) {
            course.trailerUrl = `courses/${course.id}/trailer.mp4`;
            await this.courseRepository.updateInstance(course);
        }


        return await this,this.s3Service.generatePresignedUrlUpdate(course.trailerUrl, 'video/mp4');
    }

    async clearCachePoster(courseId: string): Promise<void> {
        let course = await this.courseRepository.getCourse(courseId);
        if(!course){
            throw new NotFound('Course not found');
        }

        if(!course.posterUrl) {
            throw new NotFound('No poster to clear');
        }
        return await this.s3Service.clearCacheCloudFront(course.posterUrl);
    }

    async clearCacheTrailer(courseId: string): Promise<void> {
        let course = await this.courseRepository.getCourse(courseId);
        if(!course){
            throw new NotFound('Course not found');
        }

        if(!course.trailerUrl) {
            throw new NotFound('No poster to clear');
        }
        return await this.s3Service.clearCacheCloudFront(course.trailerUrl);
    }

    /**
     * Content based recommend system based on tag of course
     * @param userId 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    async getCoursesRecommendBasedOnTags(userId: number, page: number, pageSize: number): Promise<{ rows: Course[]; count: number}> {
        const cacheKey = `getCoursesRecommendBasedOnTags/users/${userId}`;
        const courseIdsRecommend = await this.contentBasedRecommendSystem.getCourseIdsRecommend(userId);
        const cachedResult = await this.redisService.getCache(cacheKey);
        if (cachedResult) {
            // If cached data is available, return it
            return cachedResult;
        }
        let {rows, count} = await this.courseRepository.getCoursesRecommend(courseIdsRecommend, page, pageSize);

        rows = await this.handleS3.getResourceCourses(rows);
		await this.redisService.setCache(cacheKey, {rows, count}, 60 * 5);
        return {rows, count};
    }

    /**
     * Content based recommend system based on category of course
     * @param userId 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    async getCoursesRecommend(userId: number, page: number, pageSize: number): Promise<{ rows: Course[]; count: number}> {
        const courseIdsRecommend = await this.recommendSystem.getCourseIdsRecommend(userId);
        let {rows, count} = await this.courseRepository.getCoursesRecommend(courseIdsRecommend, page, pageSize);

        rows = await this.handleS3.getResourceCourses(rows);
        return {rows, count};
    }

    async getCourseIdsRecommendForClient(courseIds: number[], page: number, pageSize: number): Promise<{ rows: Course[]; count: number}> {
        const courseIdsRecommend = await this.recommendSystem.getCourseIdsRecommendBasedOnCourseIdsFromClient(courseIds);
        console.log(courseIdsRecommend.length);
        let {rows, count} = await this.courseRepository.getCoursesRecommend(courseIdsRecommend, page, pageSize);

        rows = await this.handleS3.getResourceCourses(rows);
        return {rows, count};
    }

    async getCourseIdsRecommendBasedOnTagsForClient(courseIds: number[], page: number, pageSize: number): Promise<{ rows: Course[]; count: number}> {
        const courseIdsRecommend = await this.contentBasedRecommendSystem.getCourseIdsRecommendBasedOnCourseIdsFromClient(courseIds);

        let {rows, count} = await this.courseRepository.getCoursesRecommend(courseIdsRecommend, page, pageSize);

        rows = await this.handleS3.getResourceCourses(rows);
        return {rows, count};
    }

    /**
     * Get popular course by total Students
     * @param page 
     * @param pageSize 
     * @returns 
     */
    async getPopularCourse(page: number, pageSize: number):  Promise<{ rows: Course[]; count: number}>  {
        const options = {
            page: page || 1,
            pageSize: pageSize || 20,
            sortType: 'DESC',
            sort :  'totalStudents'
        }
        let courses = await this.courseRepository.getCourses(options);
        courses.rows = await this.handleS3.getResourceCourses(courses.rows);
        return courses;
    }

        /**
     * Get popular course by average rating
     * @param page 
     * @param pageSize 
     * @returns 
     */
    async getPopularCourseByRating(page: number, pageSize: number):  Promise<{ rows: Course[]; count: number}>  {
        const options = {
            page: page || 1,
            pageSize: pageSize || 20,
            sortType: 'DESC',
            sort :  'averageRating'
        }
        let courses = await this.courseRepository.getCourses(options);
        courses.rows = await this.handleS3.getResourceCourses(courses.rows);
        return courses;
    }

    async getIdByCourseIdsString(courseIdsString: string[]): Promise<number[]> {
        const courses = await this.courseRepository.getIdByCourseIdsString(courseIdsString);
        let courseIdsNumber : number[] = [];
        for (const course of courses) {
            courseIdsNumber.push(course.id);
        }

        return courseIdsNumber;
    }

    async getCourseByCourseIds(courseIdsString: string[]): Promise<{ rows: Course[]; count: number}> {
        const data = await this.courseRepository.getCoursesByCourseIds(courseIdsString);
        data.rows = await this.handleS3.getResourceCourses(data.rows);
        return data;
    }
    
    async getCoursesRecommendBasedOnCollaborativeFiltering(userId: number, page: number, pageSize: number): Promise<{ rows: Course[]; count: number}|null> {
        const cacheKey = `getCoursesRecommendBasedOnCollaborativeFiltering/users/${userId}`;
        const cachedResult = await this.redisService.getCache(cacheKey);
        if (cachedResult) {
            // If cached data is available, return it
            return cachedResult;
        }
        const courseIdsRecommend = await this.collaborativeFiltering.getUserSimilarityWights(userId);
        if(!courseIdsRecommend) {
            return null;
        }
        let {rows, count} = await this.courseRepository.getCoursesRecommend(courseIdsRecommend, page, pageSize);
        rows = await this.handleS3.getResourceCourses(rows);
        await this.redisService.setCache(cacheKey, {rows, count}, 60 * 5);
        return {rows, count};
    }

    private findTagsInText(text: string, tags: string[]): string[] {
        // Chuyển văn bản sang chữ thường
        const lowerCaseText = text.toLowerCase();
        // Lọc ra những tag xuất hiện trong văn bản
        const foundTags = tags.filter(tag => lowerCaseText.includes(tag.toLowerCase()));
        return foundTags;
    }

    async test(req: Request): Promise<any> {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 15;
        const results = [];
        const offset = (page - 1) * pageSize;
        const courses = await this.courseRepository.getAll({
            attributes: ['id', 'courseId', 'title', 'introduction', 'learnsDescription'],
            limit: pageSize,
            offset: offset,
        });
        const tags = await this.tagRepository.getAll();
        const tagsName = [];
        for(const tag of tags) {
            tagsName.push(tag.name);
        }
        for(const course of courses) {
            results.push({
                id: course.id,
                courseId: course.courseId,
                title: course.title,
                tags: this.findTagsInText(course.title+ course.introduction+' '+ course.learnsDescription,tagsName)
            });
        }
        return results;
    }

    private async addDataTagsForCourses() {

        const courses = await this.courseRepository.getAll({
            attributes: ['id', 'courseId', 'title', 'introduction', 'learnsDescription'],
        });

        const tags = await this.tagRepository.getAll();
        const tagsName = [];
        const tagValue: { [key: string]: number } = {};
        for(const tag of tags) {
            tagsName.push(tag.name);
            tagValue[tag.name] = tag.id;
        }

        const courseTags: any[] = [];
        for(const course of courses) {
            // Get all tag of course
            const tagsOfCourse = this.findTagsInText(course.title+ course.introduction, tagsName);
            for(const item of tagsOfCourse) {
                courseTags.push({
                    tagId: tagValue[item],
                    courseId: course.id
                });
            }
        }
        // Create data CourseTag
        await this.courseTagRepository.createInBulks(courseTags);


        const tagIdCount: { [key: number]: number } = {};
        const courseIdCount: { [key: number]: number } = {};

        courseTags.forEach(item => {
        if (tagIdCount[item.tagId]) {
            tagIdCount[item.tagId]++;
        } else {
            tagIdCount[item.tagId] = 1;
        }

        if (courseIdCount[item.courseId]) {
            courseIdCount[item.courseId]++;
        } else {
            courseIdCount[item.courseId] = 1;
        }
        });
        return {
            totalCourseTag: courseTags.length,
            tagIdCount: tagIdCount,
            courseIdCount: courseIdCount
        };
    }

    async getCourseByInputUser(query: string): Promise<any> {
        const tags = await this.tagRepository.getAll();
        const tagsName = [];
        for(const tag of tags) {
            tagsName.push(tag.name);
        }
        const tagsForQuery = this.findTagsInText(query, tagsName);
        console.log(tagsForQuery);
        const courses = await this.courseRepository.getCoursesByTags(tagsForQuery);
        return courses;
    }

    async getCourseForDebug(req: Request):Promise<Course[]> {
        const search = req.query.search || '';
        return await this.courseRepository.getAll({
            where: {
                title: { [Op.iLike]: `%${search}%` }
            },
            attributes: ['id' ,'title']
        });
    }
}
