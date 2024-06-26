import { Enrollment } from "../../models/Enrollment";
import { Request} from 'express';

export interface IEnrollmentService {
    getEnrollmentCourses(req: Request): Promise<{ rows: Enrollment[]; count: number; }>;
    addEnrollmentCourse(userId: number, courseId: number) : Promise<Enrollment>;
    isUserEnrollmentCourse(userId: number, courseId: number): Promise<boolean>;
    addEnrollmentCourseInBulk(userId: number, courseIds: number[]): Promise<Enrollment[]>;
}