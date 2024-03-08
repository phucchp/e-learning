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
}