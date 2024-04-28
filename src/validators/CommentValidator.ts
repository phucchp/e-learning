import { query, param, body } from 'express-validator';

export const validateDeleteComment = [
    param('commentId').notEmpty().withMessage('commentId is required').isInt({min:1}).withMessage('commentId must be an number'),
];

export const validateCreateComment = [
    body('content').notEmpty().withMessage('content is required')
    .isString().withMessage('content must be an string')
    .isLength({ min: 1, max: 255 }).withMessage('length of content must be min:1 and max:255'),
    body('lessonId').notEmpty().withMessage('lessonId is required')
    .isInt({ min: 1 }).withMessage('lessonId must be greater than 1'),
    body('parentId').optional().isInt({ min: 1 }).withMessage('parentId must be greater than 1'), 
];

export const validateUpdateComment = [
    body('content').notEmpty().withMessage('content is required')
    .isString().withMessage('content must be an string')
    .isLength({ min: 1, max: 255 }).withMessage('length of content must be min:1 and max:255'),
    param('commentId').notEmpty().withMessage('commentId is required').isInt({min:1}).withMessage('commentId must be an number'),
];