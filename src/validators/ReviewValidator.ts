import { query, param, body } from 'express-validator';

export const validateGetReviews = [
    
]

export const validateCreateReview = [
    body('rating').notEmpty().withMessage('rating is required!')
    .isFloat({min:0, max: 5}).withMessage('rating is min 0 and max 5.0'),
    body('courseId').notEmpty().withMessage('courseId is required')
    .isString().withMessage('courseId is a string')
    .isLength({max: 100}).withMessage('max length of courseId is 100 characters'),
    body('review').notEmpty().withMessage('review is required')
    .isString().withMessage('review is a string')
    .isLength({max: 100}).withMessage('max length of review is 255 characters'),
]