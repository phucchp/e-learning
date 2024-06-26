import { Course } from "../../models/Course";
import { Enrollment } from "../../models/Enrollment";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IEnrollmentRepository extends BaseRepositoryInterface<Enrollment> {
    getEnrollmentCourses(userId: number, options: any): Promise<{ rows: Enrollment[]; count: number}>;
	createMultiple(data: any): Promise<Enrollment[]>;
    getEnrollmentCoursesOfUser(userId: number): Promise<{ rows: Enrollment[]; count: number; }>;
}