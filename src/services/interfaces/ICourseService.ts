import { Course } from "../../models/Course";
import { Request} from 'express';

export interface ICourseService {
    getCourses(req: Request): Promise<{ rows: Course[]; count: number}>;
    getCourse(courseId: string): Promise<Course>;
    // createCourse(req: Request): Promise<Course>;
    // updateCourse(req: Request): Promise<Course>;
    // deleteCourse(courseId: string): Promise<void>;
}