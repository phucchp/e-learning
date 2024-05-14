import { Course } from "../../models/Course";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface ICourseRepository extends BaseRepositoryInterface<Course> {
    getCourses(options: any): Promise<{ rows: Course[]; count: number}>;
    getCourse(courseId: string): Promise<Course|null>;
    getAllLessonOfCourse(courseId: string): Promise<Course>;
    getCoursesRecommend(courseIds: number[], page: number, pageSize: number): Promise<{ rows: Course[]; count: number}>;
    getIdByCourseIdsString(courseIdsString: string[]): Promise<Course[]>;
}