import { Course } from "../../models/Course";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface ICourseRepository extends BaseRepositoryInterface<Course> {
    getCourses(options: any): Promise<{ rows: Course[]; count: number}>;
    getCourse(courseId: string): Promise<Course|null>;
}