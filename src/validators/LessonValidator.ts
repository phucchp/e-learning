import { query, param, body } from 'express-validator';
import { BadRequestError } from '../utils/CustomError';

const lessonsIsValid = async (lessons: any[]) => {
    // Kiểm tra từng phần tử trong mảng lessons
    for (const lesson of lessons) {
        // Kiểm tra xem mỗi phần tử có đủ 4 key hay không
        const keys = Object.keys(lesson);
        if (keys.length !== 4 || !keys.includes('title') || !keys.includes('isPreview') || !keys.includes('duration') || !keys.includes('topicId')) {
            throw new BadRequestError('Data lessons invalid');
        }
    }
};
export const validateGetLesson = [
    param('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
];

export const validateDeleteLesson = [
    param('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
];

export const validateCreateLessons = [
    body('lessons').notEmpty().isArray().custom(lessonsIsValid),
    body('lessons.*.title').notEmpty().withMessage('title of lesson is required'),
    body('lessons.*.isPreview').notEmpty().isBoolean(),
    body('lessons.*.duration').notEmpty().isInt(),
    body('lessons.*.topicId').notEmpty().isInt()
];

export const validateUpdateLesson = [
    param('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
    body('title').optional().isString().withMessage('title of lesson is isString'),
    body('isPreview').optional().isBoolean(),
    body('duration').optional().isInt(),
];

export const validateGetUrlUploadVideo = [
    query('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
]