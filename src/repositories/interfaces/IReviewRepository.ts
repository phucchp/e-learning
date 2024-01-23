import { Review } from "../../models/Review";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IReviewRepository extends BaseRepositoryInterface<Review> {
    getReviews(options: any): Promise<{ rows: Review[]; count: number}>;
    getReviewsOfCourse(options: any): Promise<{ rows: Review[]; count: number }>
    getStatiscalReviews(courseId: number): Promise<{ rows: Review[]; count: any[] }>
}