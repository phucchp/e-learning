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
    .isLength({min:5, max:100}).withMessage('password must be at least 5 characters and maximum length 100'),
    body('email').notEmpty().withMessage('email must be required')
    .isEmail().withMessage('email must be an valid email address'),
];

export const validateLogin = [
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('email must be an valid email address'),
    body('password').notEmpty().withMessage('password is required')
]

export const validateActiveUser = [
    query('token').notEmpty().withMessage('token is required'),
]

export const validateChangePassword = [
    body('oldPassword').notEmpty().withMessage('oldPassword is required'),
    body('newPassword').notEmpty().withMessage('newPassword is required')
    .isStrongPassword({
        minLength:5,
        minNumbers:1,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1
    }).withMessage('newPassword must be more than 5 characters and at least a number,a Symbols characters, a lowercase and a uppercase')
    .isLength({min:5, max:100}).withMessage('newPassword must be at least 5 characters and maximum length 100'),
]

export const validateChangePasswordUsingToken = [
    body('token').notEmpty().withMessage('token is required'),
    body('newPassword').notEmpty().withMessage('newPassword is required')
    .isStrongPassword({
        minLength:5,
        minNumbers:1,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1
    }).withMessage('newPassword must be more than 5 characters and at least a number,a Symbols characters, a lowercase and a uppercase')
    .isLength({min:5, max:100}).withMessage('newPassword must be at least 5 characters and maximum length 100'),
]

export const validateForgotPassword = [
    body('email').notEmpty().withMessage('email is required'),
]

export const validateGetAccessToken = [
    body('refreshToken').notEmpty().withMessage('Refresh Token is required').isString().withMessage('Refresh Token must be a string'),
];

export const validateGetUser = [
    param('userId').notEmpty().withMessage('userId is required').isInt({min: 1}).withMessage('userId Token must be a number'),
];

export const validateGetUsers = [
    query('roleId').optional().isInt().isIn([1, 2, 3]).withMessage(`Invalid roleId, roleId is one of 1,2,3`),
    query('isActive').optional().isBoolean().withMessage('isActive is true or false'),
    query('search').trim().optional().isString().withMessage('Search must be a string'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be an integer greater than or equal to 1'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be an integer greater than or equal to 1'),
];