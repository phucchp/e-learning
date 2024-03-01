import { query, param, body } from 'express-validator';

export const validateRegister = [
    body('username').notEmpty().withMessage('username is required')
    .isString().withMessage('username must be a string')
    .isLength({min:5, max:30}).withMessage('username must be at least 5 characters and maximum length 30'),
    body('password').notEmpty().withMessage('password is required')
    .isStrongPassword({
        minLength:5,
        minNumbers:1,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1
    }).withMessage('password must be more than 5 characters and at least a number,a Symbols characters, a lowercase and a uppercase')
    .isLength({min:5, max:100}).withMessage('username must be at least 5 characters and maximum length 100'),
    body('email').notEmpty().withMessage('email must be required')
    .isEmail().withMessage('email must be an valid email address'),
];

