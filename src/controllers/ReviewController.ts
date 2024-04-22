import { ReviewService } from "../services/ReviewService";
import { IReviewService } from "../services/interfaces/IReviewService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";

export class ReviewController{
	private reviewService: IReviewService;

	constructor() {
		this.reviewService = Container.get(ReviewService);
	}

    getReviews = async (req: Request, res: Response) => {
        const {rows, count} = await this.reviewService.getReviews(req);
        return res.status(200).json({
            message: "Successful",
            data: {
                totalCount: count,
                totalPage:  Math.ceil(count/Number(req.query.pageSize || 10)),
                page: req.query.page,
                pageSize: req.query.pageSize,
                reviews: rows,
            },

        });
    }

    /**
     * Delete review for user
     */
    deleteReview  = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId);
        const reviewId = Number(req.params.reviewId);
        await this.reviewService.deleteReview(reviewId,userId);
        return res.status(200).json({
            message: "Review deleted successfully"
        });
    }

    /**
     * Delete review for Admin
     */
    deleteReviewForAdmin  = async (req: Request, res: Response) => {
        const courseId = req.body.courseId;
        const userId = Number(req.body.userId);
        await this.reviewService.deleteReview(courseId,userId);
        return res.status(200).json({
            message: "Review deleted successfully"
        });
    }

    /**
     * Create review for User
     */
    createReview  = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId);
        if(!userId) {
            throw new UnauthorizedError('Login is required');
        }
        const {courseId, rating, review} = req.body;
        const newReview = await this.reviewService.createReview(userId, courseId, rating, review);
        return res.status(200).json({
            message: "successfully",
            data: newReview
        });
    }

    /**
     * Update review for User
     */
    updateReview  = async (req: Request, res: Response) => {
        const userId = Number(req.payload.userId);
        const { rating, review} = req.body;
        const reviewId = Number(req.params.reviewId);
        const newReview = await this.reviewService.updateReview(userId, reviewId, rating, review);
        return res.status(200).json({
            message: "successfully",
            data: newReview
        });
    }
}