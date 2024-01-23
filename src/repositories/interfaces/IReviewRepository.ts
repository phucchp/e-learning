import { Review } from "../../models/Review";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IReviewRepository extends BaseRepositoryInterface<Review> {
    getReviews(options: any): Promise<{ rows: Review[]; count: number}>;
}