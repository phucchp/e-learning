import { query, param, body } from 'express-validator';

export const validateDeleteRemind = [
    body('lessonId').notEmpty().withMessage('lessonId is required').isInt({min: 0}).withMessage('noteId must be integer and greater than 0'),
]

export const validateUpdateRemind = [
    body('lessonId').notEmpty().withMessage('lessonId is required').isInt({min: 0}).withMessage('lessonId must be integer and greater than 0'),
    body('time').isString().withMessage('time must be a string').isISO8601().withMessage('string time must be a valid date'),

]

export const validateAddRemind = [
    body('lessonId').notEmpty().withMessage('lessonId is required').isInt({min: 0}).withMessage('lessonId must be integer and greater than 0'),
    body('time').isString().withMessage('time must be a string').isISO8601().withMessage('string time must be a valid date'),
    // body('time').isDate({format: "string"})

]