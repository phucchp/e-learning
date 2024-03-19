import { query, param, body } from 'express-validator';


export const validateGetRevenue = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('statisBy').isString().isIn(['year', 'month', 'day','week']).withMessage('statisBy must be one of: year, month, week, day'),
    query('courseId').optional().isInt({min:1}),
]

export const validateGetRevenueAdmin = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('statisBy').isString().isIn(['year', 'month', 'day','week']).withMessage('statisBy must be one of: year, month, week, day'),
    query('courseId').optional().isInt({min:1}),
    query('instructorId').optional().isInt({min:1}),
]

export const validateGetRevenueByCourse = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('orderPrice').optional().isString().isIn(['ASC', 'DESC']).withMessage('orderPrice must be one of: ASC, DESC'),

]

export const validateGetRevenueByCourseAdmin = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('orderPrice').optional().isString().isIn(['ASC', 'DESC']).withMessage('orderPrice must be one of: ASC, DESC'), 
    query('instructorId').optional().isInt({min:1}),
]

export const validateGetRevenueByInstructor = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('sortBy').optional().isString().isIn(['instructorId', 'total_price']).withMessage('sortBy must be one of: instructorId, total_price'), 
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'), 

]

export const validateGetStatisCourseByCategory = [
    query('sortBy').optional().isString().isIn(['id', 'totalCourses']).withMessage('sortBy must be one of: id, totalCourses'), 
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'), 
]

export const validateGetRevenueByCategory = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('sortBy').optional().isString().isIn(['categoryId', 'total_price']).withMessage('sortBy must be one of: categoryId, total_price'), 
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'),
]

export const validateGetRevenueCourseByCategory = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'),
    query('categoryId').isInt({min:1}),
]

export const validateGetStatisCourseByLevel = [
    query('sortBy').optional().isString().isIn(['id', 'totalCourses']).withMessage('sortBy must be one of: id, totalCourses'), 
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'), 
]

export const validateGetRevenueByLevel = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('sortBy').optional().isString().isIn(['id', 'total_price']).withMessage('sortBy must be one of: id, total_price'), 
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'),
]

export const validateGetRevenueCourseByLevel = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('sortType').optional().isString().isIn(['ASC', 'DESC']).withMessage('sortType must be one of: ASC, DESC'),
    query('levelId').isInt({min:1}),
]