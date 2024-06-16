import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { IReviewService } from "../services/interfaces/IReviewService";
import { ReviewService } from "../services/ReviewService";
import { BadRequestError, NotEnoughAuthority } from "../utils/CustomError";
import { ITopicService } from "../services/interfaces/ITopicService";
import { TopicService } from "../services/TopicService";
import { UserService } from "../services/UserService";
import { IUserService } from "../services/interfaces/IUserService";
import { CartService } from "../services/CartService";
import { ICartService } from "../services/interfaces/ICartService";
import { TFIDFService } from "../services/TFIDFService";
import { QAService } from "../services/QAService";
import { IQAService } from "../services/interfaces/IQAService";
import { EnrollmentService } from "../services/EnrollmentService";
import { IEnrollmentService } from "../services/interfaces/IEnrollmentService";
import { LevelService } from "../services/LevelService";
import { ILevelService } from "../services/interfaces/ILevelService";
import { ILanguageService } from "../services/interfaces/ILanguageService";
import { LanguageService } from "../services/LanguageService";
import { ElasticsearchService } from "../services/ElasticsearchService";

export class CourseController{
	private courseService: ICourseService;
	private reviewService: IReviewService;
	private topicService: ITopicService;
	private userService: IUserService;
	private cartService: ICartService;
	private tfidfService: TFIDFService;
	private qaService: IQAService;
	private enrollmentService: IEnrollmentService;
	private levelService: ILevelService;
	private languageService: ILanguageService;
	private elasticsearchService: ElasticsearchService;

	constructor() {
		this.courseService = Container.get(CourseService);
		this.reviewService = Container.get(ReviewService);
		this.topicService = Container.get(TopicService);
		this.userService = Container.get(UserService);
		this.cartService = Container.get(CartService);
		this.tfidfService = Container.get(TFIDFService);
		this.qaService = Container.get(QAService);
		this.enrollmentService = Container.get(EnrollmentService);
		this.levelService = Container.get(LevelService);
		this.languageService = Container.get(LanguageService);
		this.elasticsearchService = Container.get(ElasticsearchService);
	}

    getCourses = async (req: Request, res: Response) => {
        const courses = await this.courseService.getCourses(req);
        const page = req.query.page || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        
        return res.status(200).json({
            message: "successfully",
            page: page,
            pageSize: pageSize,
            totalCount: courses.count,
            totalPages:  Math.ceil(courses.count/pageSize),
            data:courses.rows
        });
    }

    getAllCourseOfInstructor = async (req: Request, res: Response) => {
        const courses = await this.courseService.getAllCourseOfInstructors(req);
        const page = req.query.page || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        
        return res.status(200).json({
            message: "successfully",
            page: page,
            pageSize: pageSize,
            totalCount: courses.count,
            totalPages:  Math.ceil(courses.count/pageSize),
            data:courses.rows
        });
    }

    getCourse = async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const course = await this.courseService.getCourse(courseId);
        const groupReview = await this.reviewService.getStatiscalReviews(courseId);
        const userId = req.payload.userId;
        let isCourseFavorite = false;
        let percentCompleteCourse = null;
        let isAddedToCart = false;
        let isUserEnrollmentCourse = false;
        if(userId) {
            isCourseFavorite = await this.courseService.isCourseFavorite(course.id, userId);
            percentCompleteCourse = await this.userService.getCompletionPercentageCourse(userId, courseId);
            isAddedToCart = await this.cartService.isCourseInCartUser(userId, course.id);
            isUserEnrollmentCourse = await this.enrollmentService.isUserEnrollmentCourse(userId, course.id)
        }
        return res.status(200).json({
            message: "successfully",
            data: {
                isCourseFavorite,
                percentCompleteCourse,
                isAddedToCart,
                isUserEnrollmentCourse,
                course,
            },
            groupReview: groupReview.rows
        });
    }

    getReviewsOfCourse = async (req: Request, res: Response) => {
        const course = await this.reviewService.getReviewsOfCourse(req);
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;

        return res.status(200).json({
            message: "successfully",
            totalCount: course.count,
            page: page,
            pageSize: pageSize,
            totalPage: pageSize < course.count?Math.ceil(course.count/pageSize):course.count,
            data: course.rows,
        });
    }

    updateCourse = async (req: Request, res: Response) => {
        const course = await this.courseService.updateCourse(req);
        return res.status(200).json({
            message: "successfully",
            data: course,
        });
    }

    createCourse = async (req: Request, res: Response) => {
        const course = await this.courseService.createCourse(req);
        return res.status(201).json({
            message: "successfully",
            data: course,
        });
    }

    // =================================== TOPIC ==================================
    deleteTopic = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId); // Get userId from payload
        const topicId = Number(req.params.topicId);
        const course = await this.courseService.getCourseByTopicId(topicId);
        // Check instructor is owner this course of topic
        if (course.instructorId !== userId) {
            throw new NotEnoughAuthority('User is not owner of this course');
        }

        await this.topicService.deleteTopic(topicId);

        return res.status(200).json({
            message: "Successful"
        });
    }

    updateTopic = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId); // Get userId from payload
        const topicId = Number(req.params.topicId);
        const name = req.body.name;
        const course = await this.courseService.getCourseByTopicId(topicId);
        // Check instructor is owner this course of topic
        if (course.instructorId !== userId) {
            throw new NotEnoughAuthority('User is not owner of this course');
        }

        const newTopic = await this.topicService.updateTopic(topicId, name);
        
        return res.status(200).json({
            message: "Successful",
            data: newTopic,
        });
    }

    createTopic = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId); // Get userId from payload
        const names = req.body.names;
        const courseId = req.params.courseId;
        // Check user is owner this course
        const course = await this.courseService.getCourse(courseId);
        if (course.instructorId !== userId) {
            throw new NotEnoughAuthority('User is not owner of this course');
        }

        const topics = await this.topicService.createTopics(course.id, names);
        return res.status(201).json({
            message: "Successful",
            data: topics,
        });
    }

    clearCachePoster = async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const userId = req.payload.userId;
        if (!courseId) {
            return res.status(400).json({
                message: "courseId is required!",
            });
        }
        const course = await this.courseService.getCourse(courseId)
        if(course.instructorId !== userId && !await this.userService.isAdmin(userId)){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }
        await this.courseService.clearCachePoster(courseId.toString());
        return res.status(200).json({
            message: "Successful",
        });
    }

    getPresignedUrlToUploadPoster = async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const userId = req.payload.userId;
        if (!courseId) {
            return res.status(400).json({
                message: "courseId is required!",
            });
        }
        const course = await this.courseService.getCourse(courseId)
        if(course.instructorId !== userId && !await this.userService.isAdmin(userId)){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }
        const link = await this.courseService.getPresignedUrlToUploadPoster(courseId.toString());
        return res.status(200).json({
            message: "Successful",
            data: link
        });
    }

    clearCacheTrailer = async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const userId = req.payload.userId;
        if (!courseId) {
            return res.status(400).json({
                message: "courseId is required!",
            });
        }
        const course = await this.courseService.getCourse(courseId)
        if(course.instructorId !== userId && !await this.userService.isAdmin(userId)){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }

        await this.courseService.clearCacheTrailer(courseId.toString());
        return res.status(200).json({
            message: "Successful",
        });
    }

    getPresignedUrlToUploadTrailer = async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const userId = req.payload.userId;
        if (!courseId) {
            return res.status(400).json({
                message: "courseId is required!",
            });
        }
        const course = await this.courseService.getCourse(courseId)
        if(course.instructorId !== userId && !await this.userService.isAdmin(userId)){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }
        const link = await this.courseService.getPresignedUrlToUploadTrailer(courseId.toString());
        return res.status(200).json({
            message: "Successful",
            data: link
        });
    }

    getRecommendCourse  = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        if (!userId) {
            // Recommend popolar courses
            const {rows, count} = await this.courseService.getPopularCourse(page, pageSize);
            return res.status(200).json({
                message: "Successful",
                note: "Recommended popolar courses",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }
        const {rows, count} = await this.courseService.getCoursesRecommend(userId,page,pageSize);
        return res.status(200).json({
            message: "Successful",
            totalCount: count,
            page: page,
            pageSize: pageSize,
            data: rows
        });
    }

    getRecommendCourseClient  = async (req: Request, res: Response) => {
        // Parse courseIds from query parameter as string
        const courseIdsString: string | undefined = req.query.courseIds as string;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        // Initialize courseIds array
        let courseIds: string[] = [];

        // Check if courseIdsString is defined and not empty
        if (courseIdsString && courseIdsString.trim() !== '') {
            // Split the string by comma and trim each element
            courseIds = courseIdsString.split(',').map(id => id.trim());
        }
        
        if(courseIds.length > 0) {
            // Get courseIds number from courseIdsString
            const courseIdsNumber = await this.courseService.getIdByCourseIdsString(courseIds);
            const {rows, count} = await this.courseService.getCourseIdsRecommendForClient(courseIdsNumber, page, pageSize);
            return res.status(200).json({
                message: "Successful",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }else{
            // Recommend popolar courses
            const {rows, count} = await this.courseService.getPopularCourse(page, pageSize);
            return res.status(200).json({
                message: "Successful",
                note: "Recommended popular courses",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }
    }

    getRecommendCourseBasedOneTagForClient  = async (req: Request, res: Response) => {
        // Parse courseIds from query parameter as string
        const courseIdsString: string | undefined = req.query.courseIds as string;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        // Initialize courseIds array
        let courseIds: string[] = [];

        // Check if courseIdsString is defined and not empty
        if (courseIdsString && courseIdsString.trim() !== '') {
            // Split the string by comma and trim each element
            courseIds = courseIdsString.split(',').map(id => id.trim());
        }
        
        if(courseIds.length > 0) {
            // Get courseIds number from courseIdsString
            const courseIdsNumber = await this.courseService.getIdByCourseIdsString(courseIds);
            console.log(courseIdsNumber);
            const {rows, count} = await this.courseService.getCourseIdsRecommendBasedOnTagsForClient(courseIdsNumber, page, pageSize);
            return res.status(200).json({
                message: "Successful",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }else{
            // Recommend popolar courses
            const {rows, count} = await this.courseService.getPopularCourse(page, pageSize);
            return res.status(200).json({
                message: "Successful",
                note: "Recommended popular courses",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }
    }

    tfidf = async (req: Request, res: Response) => {
        const data = await this.tfidfService.getDataDocumentFromCourses();
        return res.status(200).json({
            data
        });
    }
    
    // ==========================QUESTION & ANSWER======================================
    createQA = async (req: Request, res: Response) => {
        // Check role isAdmin or isInstructor
        const topicId = Number(req.params.topicId);
        const userId = req.payload.userId;
        const course = await this.courseService.getCourseByTopicId(topicId);
        if(course.instructorId !== userId && !await this.userService.isAdmin(userId)){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }
        const data = await this.qaService.createQA(req);
        return res.status(200).json({
            message: "Successful",
            data: data
        });
    }

    deleteQuestion = async (req: Request, res: Response) => {
        const questionId = req.params.questionId;
        const userId = req.payload.userId;
        // Check role isAdmin or isInstructor
        const topicId = Number(req.params.topicId);
        const course = await this.courseService.getCourseByTopicId(topicId);
        if(course.instructorId !== userId && !await this.userService.isAdmin(userId)){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }
        const data = await this.qaService.deleteQuestion(Number(questionId));
        return res.status(200).json({
            message: "Successful",
        });
    }

    getAllQuestionOfTopic = async (req: Request, res: Response) => {
        const topicId = req.params.topicId;
        const userId  = req.payload.userId;
        // check user is enrollment course
        const course = await this.courseService.getCourseByTopicId(Number(topicId));
        if(course.instructorId !== userId 
            && !await this.userService.isAdmin(userId)
            && !await this.enrollmentService.isUserEnrollmentCourse(userId, course.id) // User is not enrollment course
        ){
            throw new NotEnoughAuthority('User is not owner course or user is not admin!');
        }
        const {rows, count} = await this.qaService.getAllQuestionOfTopic(Number(topicId));
        return res.status(200).json({
            message: "Successful",
            totalCount: count,
            data:rows
        })
    }

    getCoursesRecommendBasedOnCollaborativeFiltering = async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 15;
        const userId = req.payload.userId;
        if(!userId) {
            const {rows, count} = await this.courseService.getPopularCourseByRating(page, pageSize);
            return res.status(200).json({
                message: "Successful",
                note: "Recommended popular courses",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }
        
        const results = await this.courseService.getCoursesRecommendBasedOnCollaborativeFiltering(userId,page,pageSize);
        if(!results) {
            const {rows, count} = await this.courseService.getPopularCourseByRating(page, pageSize);
            return res.status(200).json({
                message: "Successful",
                note: "Recommended popular courses",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }

        return res.status(200).json({
            message: "Successful",
            totalCount: results.count,
            page: page,
            pageSize: pageSize,
            data: results.rows
        });
    }
    
    getCoursesByCourseIds = async (req: Request, res: Response) => {
        // Parse courseIds from query parameter as string
        const courseIdsString: string | undefined = req.query.courseIds as string;
        // Initialize courseIds array
        let courseIds: string[] = [];

        // Check if courseIdsString is defined and not empty
        if (courseIdsString && courseIdsString.trim() !== '') {
            // Split the string by comma and trim each element
            courseIds = courseIdsString.split(',').map(id => id.trim());
        }

        if(courseIds.length > 0) {
            const {rows, count} = await this.courseService.getCourseByCourseIds(courseIds);
            return res.status(200).json({
                message: "Successful",
                totalCount: count,
                data:rows
            });
        }
    }

    getRecommendCourseBasedOnTags  = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        if (!userId) {
            // Recommend popolar courses
            const {rows, count} = await this.courseService.getPopularCourse(page, pageSize);
            return res.status(200).json({
                message: "Successful",
                note: "Recommended popolar courses",
                totalCount: count,
                page: page,
                pageSize: pageSize,
                data: rows
            });
        }
        const {rows, count} = await this.courseService.getCoursesRecommendBasedOnTags(userId,page,pageSize);
        return res.status(200).json({
            message: "Successful",
            totalCount: count,
            page: page,
            pageSize: pageSize,
            data: rows
        });
    }

    test = async (req: Request, res: Response) => {
        const results = await this.courseService.test(req);
        return res.status(200).json({
            results
        });
    }

    getCoursesForAiRecommend = async (req: Request, res: Response) => {
        const query= req.query.query;
        if(!query) {
            throw new BadRequestError('Missing query parameter');
        }
        const rs = await this.courseService.getCourseByInputUser(query.toString());
        return res.status(200).json({
            message: "successfully",
            totalCount: rs.count,
            data:rs.rows
        });
    }

    addUserEnrollmentCoursesForAdmin = async (req: Request, res: Response) => { 
        const userId = req.body.userId;
        const courseIds = req.body.courseIds;
        const listId: number[] = [];
        for(const courseId of courseIds) {
            if(!await this.enrollmentService.isUserEnrollmentCourse(userId, courseId)) {
                listId.push(courseId);
            }
        }
        await this.enrollmentService.addEnrollmentCourseInBulk(userId, listId);
        return res.status(200).json({
            message: "Successful"
        })
    }

    getCoursesDebug = async (req: Request, res: Response) => {
        const courses = await this.courseService.getCourseForDebug(req);
        return res.status(200).json({
            courses
        })
    }

    getAllFilterFoSearchCourse = async (req: Request, res: Response) => {
        const levels = await this.levelService.getLevels();
        const languages = await this.languageService.getLanguages();
        const ratings = [
            3, 3.5, 4, 4.5
        ];

        const videoDurations = [
            'extraShort', 'short', 'medium', 'long', 'extraLong'
        ];

        const prices = [
            'paid', 'free'
        ];

        return res.status(200).json({
            levels,
            languages,
            ratings,
            videoDurations,
            prices
        });
    }

    getCourseByElasticsearch = async (req: Request, res: Response) => {
        await this.elasticsearchService.checkConnection();
    }

    searchCourses = async (req: Request, res: Response) => {
        const search = req.query.search;
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.pageSize) || 15;

        let languages = req.query.languages;
        let levels = req.query.levels;
        let prices = req.query.prices;
        let durations = req.query.durations;

        let languagesArr: string[] = [];
        let levelsArr: string[] = [];
        let pricesArr: string[] = [];
        let durationsArr: string[] = [];

        if(languages && Array.isArray(languages)) {
            for(const language of languages) {
                languagesArr.push(language.toString());
            }
        }

        if(levels && Array.isArray(levels)) {
            for(const level of levels) {
                levelsArr.push(level.toString());
            }
        }

        if(prices && Array.isArray(prices)) {
            for(const price of prices) {
                pricesArr.push(price.toString());
            }
        }

        if(durations && Array.isArray(durations)) {
            for(const duration of durations) {
                durationsArr.push(duration.toString());
            }
        }

        // querySearch: string,
        // languages?: string[],
        // levels?: string[],
        // price?: string[],
        // durations?: string[],
        // page: number = 1,
        // pageSize: number = 10,
        const sortField = req.query.sortField?.toString() || 'averageRating';
        const sortOrder = req.query.sortOrder?.toString() || 'desc';
        const results = await this.elasticsearchService.searchCourses(
            search?.toString() || '',
            languagesArr,
            levelsArr,
            pricesArr,
            durationsArr,
            page,
            size
        );
        return res.status(200).json(results);
    }
}