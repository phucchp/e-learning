import { Inject, Service } from 'typedi';
import { IReviewService } from './interfaces/IReviewService';
import { Review } from '../models/Review';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { NotFound, RecordExistsError, ServerError, UnauthorizedError, handleErrorFunction } from '../utils/CustomError';
import * as crypto from 'crypto';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { IReviewRepository } from '../repositories/interfaces/IReviewRepository';
import { Op } from 'sequelize';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';

@Service()
export class ReviewService implements IReviewService {

    @Inject(() => ReviewRepository)
	private reviewRepository!: IReviewRepository;

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;
    
    async getReviews(req: Request): Promise<{ rows: Review[]; count: number }> {
        try {
            let { rating, userId, courseId,sort, sortType , page, pageSize} = req.query;
            const whereCondition: any = {};
            if(userId){
                whereCondition['userId'] = userId;
            }
            if(courseId){
                whereCondition['courseId'] = courseId;
            }
            if(rating){
                whereCondition['rating'] = {[Op.gt]: rating};
            }
            const options = {
                page: page || 1,
                pageSize: pageSize || 10,
                whereCondition: whereCondition,
                sortType: sortType || 'ASC',
                sort : sort || 'createdAt'
            }
            const reviews = await this.reviewRepository.getReviews(options);
            return reviews;
        } catch (error) {
            handleErrorFunction(error);
        }
    }
    
    async getReview(reviewId: string): Promise<Review> {
        try {
            throw new Error('Method not implemented.');
        } catch (error) {
            handleErrorFunction(error);
        }
    }
    
    async createReview(userId: number, courseId: string, rating: number, review: string): Promise<Review> {
        try {
            const reviewInstance = await this.reviewRepository.findOneByCondition({
                courseId: courseId,
                userId: userId
            });
            const course = await this.courseRepository.findOneByCondition({ courseId: courseId });
            if(!course){
                throw new NotFound('Course not found');
            }
            if(reviewInstance){
                throw new RecordExistsError('Review already exists!');
            }
            return await this.reviewRepository.create({
                userId: userId,
                courseId: course.id,
                review: review, 
                rating: rating
            });
        } catch (error) {
            handleErrorFunction(error);
        }
    }
    
    async updateReview(userId: number, courseId: string, rating: number, review: string): Promise<Review> {
        try {
            const reviewInstance = await this.reviewRepository.findOneByCondition({
                courseId: courseId,
                userId: userId
            });
            if(!reviewInstance){
                throw new NotFound('Review not found!');
            }
            reviewInstance.rating = rating;
            reviewInstance.review = review;

            const newReview = await this.reviewRepository.updateInstace(reviewInstance);
            if(!newReview){
                throw new ServerError('Error updating review, please try again!');
            }
            return newReview;
        } catch (error) {
            handleErrorFunction(error);
        }
    }

    async deleteReview(courseId: string, userId: number): Promise<void> {
        try {
            const review = await this.reviewRepository.findOneByCondition({
                courseId: courseId,
                userId: userId
            });
            if(!review) {
                throw new NotFound('Review not found or deleted');
            }
            await this.reviewRepository.deleteInstace(review, true);
        } catch (error) {
            handleErrorFunction(error);
        }
    }
}