import { Course } from "../../models/Course";
import { Request} from 'express';
import { Favorite } from "../../models/Favorite";

export interface ICourseService {
    getCourses(req: Request): Promise<{ rows: Course[]; count: number}>;
    getCourse(courseId: string): Promise<Course>;
    createCourse(req: Request): Promise<Course>;
    updateCourse(req: Request): Promise<Course>;
    // deleteCourse(courseId: string): Promise<void>;
    getCourseIdByLessonId(courseId: number): Promise<number>;
    isCourseFavorite(courseId: number, userId: number): Promise<boolean>;
    addCourseFavorite(courseId: string, userId: number): Promise<boolean>;
    deleteCourseFavorite(courseId: string, userId: number): Promise<boolean>;
    getCoursesFavorite(req: Request): Promise<{ rows: Favorite[]; count: number; }>;
    getCourseByLessonId(lessonId: number): Promise<Course>;
    isUserOwnerCourse(courseId: number, userId: number): Promise<boolean>;
    getCourseByTopicId(topicId: number): Promise<Course>;
    createDataCourseForPayment(courseIds: string[]): Promise<any>;
    getCoursesByCourseIds(courseIds: number[]): Promise<Course[]>;
    getLessonIdsOfCourse(courseId: string): Promise<number[]>;
    getPresignedUrlToUploadPoster(courseId: string): Promise<string>;
    clearCachePoster(courseId: string): Promise<void>;
    getCoursesRecommend(userId: number, page: number, pageSize: number): Promise<{ rows: Course[]; count: number}>;
    getCourseIdsRecommendForClient(courseIds: number[], page: number, pageSize: number): Promise<{ rows: Course[]; count: number}>;
    getIdByCourseIdsString(courseIdsString: string[]): Promise<number[]>;
    getPopularCourse(page: number, pageSize: number):  Promise<{ rows: Course[]; count: number}>;
    getCoursesRecommendBasedOnCollaborativeFiltering(userId: number, page: number, pageSize: number): Promise<{ rows: Course[]; count: number} | null>;
    getPopularCourseByRating(page: number, pageSize: number):  Promise<{ rows: Course[]; count: number}>;
    getCourseByCourseIds(courseIdsString: string[]): Promise<{ rows: Course[]; count: number}>;
    test(req: Request): Promise<any>;
    getCoursesRecommendBasedOnTags(userId: number, page: number, pageSize: number): any;
    getCourseIdsRecommendBasedOnTagsForClient(courseIds: number[], page: number, pageSize: number): Promise<{ rows: Course[]; count: number}>;
    getCourseByInputUser(query: string): Promise<any>;
}