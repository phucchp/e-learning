import { Course } from "../../models/Course";
import { Request} from 'express';

export interface ICourseService {
    getCourses(): Promise<Course[]>;
    // getCourse(courseId: string): Promise<Course>;
    // createCourse(req: Request): Promise<Course>;
    // updateCourse(req: Request): Promise<Course>;
    // deleteCourse(courseId: string): Promise<void>;
}