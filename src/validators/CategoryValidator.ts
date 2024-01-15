import { query, param, body } from 'express-validator';

export const validateGetCategory = [
    param('categoryId').notEmpty().withMessage('categoryId is required').isString().withMessage('categoryId must be an string'),
];

export const validateDeleteCategory = [
    param('categoryId').notEmpty().withMessage('categoryId is required').isString().withMessage('categoryId must be an string'),
];

export const validateCreateCategory = [
    body('name').notEmpty().withMessage('name is required')
    .isString().withMessage('name must be an string')
    .isLength({ min: 1, max: 100 }).withMessage('length of name must be min:1 and max:100')
];

export const validateUpdateCategory = [
    body('name').notEmpty().withMessage('name is required')
    .isString().withMessage('name must be an string')
    .isLength({ min: 1, max: 100 }).withMessage('length of name must be min:1 and max:100'),
    param('categoryId').notEmpty().withMessage('categoryId is required').isString().withMessage('categoryId must be an string')
];