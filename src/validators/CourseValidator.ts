import { query, param, body } from 'express-validator';
import { Language } from '../models/Language';
import { NotFound } from '../utils/CustomError';

// Custom validation function to check if languageId exists
const languageIdExists = async (value: number) => {
    const language = await Language.findByPk(value);
    if (!language) {
    //   return Promise.reject('Invalid languageId');
      throw new NotFound('Language not found!');
    }
};

export const validateGetCourses = [
    query('search').trim().optional().isString().withMessage('Search must be a string'),
    query('category').optional().isString().withMessage('Category must be a string').trim(),
    query('averageRating').optional().isFloat({ min: 0.0, max: 5.0 }).withMessage('Average rating must be a float between 0.0 and 5.0'),
    query('languageId').optional().isInt({ min: 1 }).withMessage('languageId is min 1').custom(languageIdExists),
    query('instructorId').optional().isInt({ min: 1 }).withMessage('languageId is min 1'),
    query('level').optional().isInt({ min: 1 }).withMessage('Level instructorId be an integer greater than or equal to 1'),
    query('duration').optional().isArray().isIn(['extraShort', 'short', 'medium', 'long', 'extraLong']).withMessage(`Invalid duration, duration is one of 'extraShort', 'short', 'medium', 'long', 'extraLong'`),
    query('sort').optional().isIn(['price', 'discount', 'duration', 'averageRating', 'totalStudents', 'createdAt']).withMessage('Invalid sort parameter'),
    query('sortType').optional().isIn(['ASC', 'DESC']).withMessage('Invalid sortType parameter'),
    query('price').optional().isIn(['free', 'paid']).withMessage('Invalid price parameter, price is free or paid'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be an integer greater than or equal to 1'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be an integer greater than or equal to 1'),
];

export const validateGetCourse = [
    param('courseId').notEmpty().isString().withMessage('courseId must be a string').trim(),
]

export const validateUpdateCourse = [
  param('courseId').notEmpty().isString().withMessage('courseId must be a string').trim(),
  body('title').optional().isString().withMessage('title must be a string').trim().isLength({ min: 1, max: 255 }).withMessage('length of title must be min:1 and max:255'),
  body('introduction').optional().isString().withMessage('introduction must be a string').trim(),
  body('description').optional().isString().withMessage('description must be a string').trim(),
  body('learnsDescription').optional().isString().withMessage('learnsDescription must be a string').trim(),
  body('requirementsDescription').optional().isString().withMessage('learnsDescription must be a string').trim(),
  body('price').optional().isFloat({min: 0, max: 9999}).withMessage('price must be a float and must be greater than 0'),
  body('discount').optional().isInt({min: 0,max: 100}).withMessage('discount must be a integer and must be greater than 0 and must be less than 100'),
  body('categoryId').optional().isString().withMessage('categoryId must be a string').trim(),
  body('languageId').optional().isInt({min: 1}).withMessage('languageId must be a integer'),
  body('levelId').optional().isInt({min: 1}).withMessage('levelId must be a integer'),
]

export const validateCreateCourse = [
  body('title').optional().isString().withMessage('title must be a string').trim().isLength({ min: 1, max: 255 }).withMessage('length of title must be min:1 and max:255'),
  body('introduction').optional().isString().withMessage('introduction must be a string').trim(),
  body('description').optional().isString().withMessage('description must be a string').trim(),
  body('learnsDescription').optional().isString().withMessage('learnsDescription must be a string').trim(),
  body('requirementsDescription').optional().isString().withMessage('learnsDescription must be a string').trim(),
  body('price').optional().isFloat({min: 0, max: 9999}).withMessage('price must be a float and must be greater than 0'),
  body('discount').optional().isInt({min: 0,max: 100}).withMessage('discount must be a integer and must be greater than 0 and must be less than 100'),
  body('categoryId').optional().isString().withMessage('categoryId must be a string').trim(),
  body('languageId').optional().isInt({min: 1}).withMessage('languageId must be a integer'),
  body('levelId').optional().isInt({min: 1}).withMessage('levelId must be a integer'),
]

export const validateAddFavoriteCourse = [
  body('courseId').notEmpty().isString().withMessage('courseId must be a string').trim().isLength({ min: 1, max: 255 }).withMessage('length of title must be min:1 and max:255'),
]

export const validateDeleteFavoriteCourse = [
  body('courseId').notEmpty().isString().withMessage('courseId must be a string').trim().isLength({ min: 1, max: 255 }).withMessage('length of title must be min:1 and max:255'),
]

// Topic
export const validateCreateTopic = [
  param('courseId').notEmpty().isString().withMessage('courseId must be a string'),
  body('names').isArray().withMessage('Names must be an array'),
  body('names.*').isString().withMessage('Each element in names must be a string'),
]

export const validateUpdateTopic = [
  param('topicId').notEmpty().isInt({min: 1}).withMessage('topicId must be a integer number and must be greater than 1'),
  body('name').notEmpty().isString().withMessage('name is required and must be string')
]

export const validateDeleteTopic = [
  param('topicId').notEmpty().isInt({min: 1}).withMessage('topicId must be a integer number and must be greater than 1') 
]

export const validateGetListInstructors= [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be an integer greater than or equal to 1'),
  query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be an integer greater than or equal to 1'),
]

export const validateGetInstructorDetail = [
  param('instructorId').notEmpty().isInt({ min: 1 }).withMessage('instructorId must be an integer greater than or equal to 1')
]

export const validateUpdateProfile = [
  body('firstName').optional().isString().withMessage('firstName must be a string').trim().isLength({ min: 1, max: 255 }).withMessage('length of firstName must be min:1 and max:255'),
  body('lastName').optional().isString().withMessage('lastName must be a string').trim().isLength({ min: 1, max: 255 }).withMessage('length of lastName must be min:1 and max:255'),
  body('description').optional().isString().withMessage('description must be a string').trim()
]