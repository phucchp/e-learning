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
    body('courseIds').notEmpty().withMessage('courseIds is required').isArray({min:1}).custom(languageIdExists),
]
