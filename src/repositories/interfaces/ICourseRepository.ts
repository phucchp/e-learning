import { Course } from "../../models/Course";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface ICourseRepository extends BaseRepositoryInterface<Course> {
    getCourses(page?: number, pageSize?:number): Promise<Course[]>;
}