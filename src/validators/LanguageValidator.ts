import { query, param, body } from 'express-validator';

export const validateGetLanguage = [
    param('languageId').notEmpty().withMessage('languageId is required').isInt({min:1}).withMessage('languageId must be an number'),
];

export const validateDeleteLanguage = [
    param('languageId').notEmpty().withMessage('languageId is required').isInt({min:1}).withMessage('languageId must be an number'),
];

export const validateCreateLanguage = [
    body('languageName').notEmpty().withMessage('languageName is required')
    .isString().withMessage('languageName must be an string')
    .isLength({ min: 1, max: 100 }).withMessage('length of languageName must be min:1 and max:100')
];

export const validateUpdateLanguage = [
    body('languageName').notEmpty().withMessage('languageName is required')
    .isString().withMessage('languageName must be an string')
    .isLength({ min: 1, max: 100 }).withMessage('length of languageName must be min:1 and max:100'),
    param('languageId').notEmpty().withMessage('languageId is required').isString().withMessage('languageId must be an string')
];