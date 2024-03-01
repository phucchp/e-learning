import { Enrollment } from "../../models/Enrollment";
import { Request} from 'express';

export interface IEnrollmentService {
    getEnrollmentCourses(req: Request): Promise<{ rows: Enrollment[]; count: number; }>;
}