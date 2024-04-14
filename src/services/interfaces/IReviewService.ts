import { Review } from "../../models/Review";
import { Request} from 'express';

export interface IReviewService {
    getReviews(req: Request): Promise<{ rows: Review[]; count: number }>;
    getReview(reviewId: string): Promise<Review>;
    createReview(userId: number, courseId: string, rating: number, review: string): Promise<Review>;
    updateReview(userId: number, reviewId: number, rating: number, review: string): Promise<Review>;
    deleteReview(reviewId: number, userId: number): Promise<void>;
    getReviewsOfCourse(req: Request): Promise<{ rows: Review[]; count: number }>;
    getStatiscalReviews(courseId: string): Promise<{ rows: Review[]; count: any[]}>;
}