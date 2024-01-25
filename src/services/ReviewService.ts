import { Inject, Service } from 'typedi';
import { IReviewService } from './interfaces/IReviewService';
import { Review } from '../models/Review';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { NotEnoughAuthority, NotFound, RecordExistsError, ServerError, UnauthorizedError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { IReviewRepository } from '../repositories/interfaces/IReviewRepository';
import { Op } from 'sequelize';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';

@Service()
export class ReviewService implements IReviewService {

    @Inject(() => ReviewRepository)
	private reviewRepository!: IReviewRepository;

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => EnrollmentRepository)
	private enrollmentRepository!: IEnrollmentRepository;
    
    async getReviews(req: Request): Promise<{ rows: Review[]; count: number }> {
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
    }
    
    async getReview(reviewId: string): Promise<Review> {
        throw new Error('Method not implemented.');
    }
    
    async createReview(userId: number, courseId: string, rating: number, review: string): Promise<Review> {
        const course = await this.courseRepository.findOneByCondition({ courseId: courseId });
        if(!course){
            throw new NotFound('Course not found');
        }
        const enrollmentCourse = await this.enrollmentRepository.findOneByCondition({
            courseId: course.id,
            userIdent: userId
        });

        if(!enrollmentCourse){
            throw new NotEnoughAuthority('User must enrollment course to be rating');
        }

        const reviewInstance = await this.reviewRepository.findOneByCondition({
            courseId: course.id,
            userId: userId
        });
        if(reviewInstance){
            throw new RecordExistsError('User already review this course before!');
        }
        return await this.reviewRepository.create({
            userId: userId,
            courseId: course.id,
            review: review, 
            rating: rating
        });
    }
    
    async updateReview(userId: number, courseId: string, rating: number, review: string): Promise<Review> {
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
    }

    async deleteReview(courseId: string, userId: number): Promise<void> {
        const review = await this.reviewRepository.findOneByCondition({
            courseId: courseId,
            userId: userId
        });
        if(!review) {
            throw new NotFound('Review not found or deleted');
        }
        await this.reviewRepository.deleteInstace(review, true);
    }

    async getReviewsOfCourse(req: Request): Promise<{ rows: Review[]; count: number }> {
        const courseId = req.params.courseId;
        const {page , pageSize, sort, sortType, rating} = req.query;
        const whereCondition: any = {};

        const course = await this.courseRepository.findOneByCondition({
            courseId: courseId
        });
        if(!course){
            throw new NotFound('Course not found');
        }
    
        whereCondition['courseId'] = course.id;
        if(rating){
            whereCondition[Op.and] = [
                { rating: { [Op.gte]: rating } },
                { rating: { [Op.lt]: Number(rating)+1 } },
            ];
        }
        const options = {
            page: page || 1,
            pageSize: pageSize || 10,
            whereCondition: whereCondition,
            sortType: sortType || 'ASC',
            sort : sort || 'createdAt'
        }
        const reviews = await this.reviewRepository.getReviewsOfCourse(options);
        return reviews;
    }
    async getStatiscalReviews(courseId: string): Promise<{ rows: Review[]; count: any[]}>{
        const course = await this.courseRepository.findOneByCondition({
            courseId: courseId
        });
        if(!course){
            throw new NotFound('Course not found');
        }
        const results = await this.reviewRepository.getStatiscalReviews(course.id);
        return results;
    }
}