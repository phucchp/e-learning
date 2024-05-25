import { query, param, body } from 'express-validator';
import { Course } from '../models/Course';
import { BadRequestError, NotFound } from '../utils/CustomError';

// Custom validation function to check if languageId exists
const languageIdExists = async (courseIds: string[]) => {
    // Nếu mảng rỗng, không cần kiểm tra từng phần tử
    if (courseIds.length === 0) {
        throw new BadRequestError('courseIds must be length > 0!');
      }
  
      // Kiểm tra từng phần tử trong mảng
      for (let courseId of courseIds) {
        if (!courseId || typeof courseId !== 'string' || courseId.trim() === '') {
          throw new Error('Mỗi phần tử trong courseIds phải là một chuỗi không trống');
        }
      }
    
};

export const validateCreatePayment = [
  body('courseIds').notEmpty().withMessage('courseIds is required').isArray({min:1}).custom(languageIdExists)
];

export const validateCaptureOrder = [
  body('orderID').notEmpty().withMessage('orderID is required')
];

export const validateGetInstructorPayment = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be an integer greater than or equal to 1'),
  query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be an integer greater than or equal to 1'),
  query('sort').optional().isIn(['id', 'instructorId', 'amount','createdAt']).withMessage('Invalid sort parameter'),
  query('sortType').optional().isIn(['ASC', 'DESC']).withMessage('Invalid sortType parameter'),
  query('instructorId').optional().isInt({ min: 1 }).withMessage('instructorId must be an integer greater than or equal to 1'),
  query('payoutBatchId').trim().optional().isString().withMessage('payoutBatchId must be a string'),
  query('payForMonth').optional().isInt({ min: 1 }).withMessage('payForMonth must be an integer greater than or equal to 1'),
  query('payForYear').optional().isInt({ min: 1 }).withMessage('payForYear must be an integer greater than or equal to 1'),
  query('receiver').trim().optional().isString().withMessage('receiver must be a string'),
  query('isTransfer').optional().isBoolean().withMessage('isTransfer must be a boolean'),
];