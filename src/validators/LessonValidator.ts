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
];

export const validateGetSubtitle = [
    param('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
    query('languageCode').notEmpty().withMessage('languageCode is required').isString().withMessage('languageCode must be a string')
];

export const validateGetPresignUrlUpdateSubtitle = [
    param('subtitleId').notEmpty().withMessage('subtitleId is required').isInt({min:1}).withMessage('subtitleId must be an number')
];

export const validateAddSubtitle = [
    param('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
    body('languageId').notEmpty().withMessage('languageId is required').isInt({min:1}).withMessage('languageId must be an number')
];

export const validateDeleteSubtitle = [
    param('subtitleId').notEmpty().withMessage('subtitleId is required').isInt({min:1}).withMessage('subtitleId must be an number')
];

// RESOURCE
export const validateGetAllResource = [
    param('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number')
];

export const validateGetResource = [
    param('resourceId').notEmpty().withMessage('resourceId is required').isInt({min:1}).withMessage('resourceId must be an number')
];

export const validateCreateResource = [
    body('lessonId').notEmpty().withMessage('lessonId is required').isInt({min:1}).withMessage('lessonId must be an number'),
    body('name')
        .notEmpty().withMessage('name is required')
        .isString().withMessage('name must be a string')
        .custom(value => {
            // Kiểm tra xem name có phải là một trong các đuôi file được cho hay không
            const validExtensions = ['.pdf', '.docx', '.zip', '.xlsx', '.txt', '.pptx'];
            const extension = value.slice(value.lastIndexOf('.'));
            if (!validExtensions.includes(extension)) {
                throw new Error('Invalid file extension');
            }
            return true;
        })
        .trim()
];

export const validateDeleteResource = [
    param('resourceId').notEmpty().withMessage('resourceId is required').isInt({min:1}).withMessage('resourceId must be an number')
];