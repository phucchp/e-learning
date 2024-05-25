import { query, param, body } from 'express-validator';

export const validateCreateEWallet = [
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('email must be an valid email address'),
]

export const validateUpdateEWallet = [
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('email must be an valid email address'),
]