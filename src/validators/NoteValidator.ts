import { query, param, body } from 'express-validator';

export const validateGetNotes = [
    query('lessonId').notEmpty().withMessage('lessonId is required').isInt({min: 0}).withMessage('lessonId must be integer and greater than 0'),
    query('sort').optional().isString().isIn(['oldest', 'newest']).withMessage(`sort must be a string and is in 'ordest' or 'newest`),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be an integer greater than or equal to 1'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be an integer greater than or equal to 1'),
    query('search').trim().optional().isString().withMessage('Search must be a string'),
    query('time').optional().isInt({min:0}).withMessage('Time must be a number and greater than 0')
]

export const validateDeleteNote = [
    param('noteId').notEmpty().withMessage('noteId is required').isInt({min: 0}).withMessage('noteId must be integer and greater than 0'),
]

export const validateUpdateNote = [
    param('noteId').notEmpty().withMessage('noteId is required').isInt({min: 0}).withMessage('noteId must be integer and greater than 0'),
    body('content').isString().withMessage('content must be a string').isLength({min:0, max:1000}),
    body('time').optional().isInt({min: 0}).withMessage('time must be a number and greater than 0'),
]

export const validateCreateNote = [
    body('lessonId').notEmpty().withMessage('lessonId is required').isInt({min: 0}).withMessage('lessonId must be integer and greater than 0'),
    body('content').isString().withMessage('content must be a string').isLength({min:0, max:1000}),
    body('time').isInt({min: 0}).withMessage('time must be a number and greater than 0'),
]