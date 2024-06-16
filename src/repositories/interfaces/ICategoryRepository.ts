import { Category } from "../../models/Category";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface ICategoryRepository extends BaseRepositoryInterface<Category> {
    getCourseByCategory(): Promise<Category[]>;
}