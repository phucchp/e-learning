import { query, param, body } from 'express-validator';

export const validateDeleteCategory = [
    param('categoryId').notEmpty().withMessage('categoryId is required').isString().withMessage('categoryId must be an string'),
];
