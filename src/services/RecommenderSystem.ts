import { Inject, Service } from 'typedi';
import { IProfileService } from './interfaces/IProfileService';
import { Profile } from '../models/Profile';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Course } from '../models/Course';
import { Level } from '../models/Level';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { LevelRepository } from '../repositories/LevelRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { ILevelRepository } from '../repositories/interfaces/ILevelRepository';
import { Category } from '../models/Category';
import { UserRepository } from '../repositories/UserRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';

interface Row {
    [key: string]: number; // Định dạng cụ thể của các giá trị trong hàng
}

interface Matrix {
    [key: string]: Row; // Định dạng cụ thể của các hàng trong ma trận
}
@Service()
export class RecommenderSystem {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => LevelRepository)
	private levelRepository!: ILevelRepository;

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    @Inject(() => UserRepository)
	private userRepository!: IUserRepository;

    private favoritePoint = 5;
    private viewedPoint = 4;
    private enrollmentPoint = 2;
    private inCartPoint = 3;

    async test(): Promise<any> {
        return await this.getUserData(146);
    }
    
    /**
     * Create full matrix between courses and categories
     */
    public async createMatrix(): Promise<Matrix> {
        const matrix: number[][] = [];
        const matrixRcm : Matrix = {};
        const dataRows : Row = {};
        const categoryArray:string[] = [];
        const levels: Level[] = await this.levelRepository.getAll({
            attributes: ['id','levelName']
        }); // Handle để get từ cache redis ra
        const categories: Category[] = await this.categoryRepository.getAll({
            attributes: ['id','categoryId', 'name']
        });
        const courses: Course[] =  await this.courseRepository.getAll({
            attributes: ['id','courseId', 'levelId', 'categoryId']
        });
        // Sử dụng Set để lưu trữ các giá trị không trùng nhau
        let uniqueCourseIds = new Set<number>();
        let uniqueLevelIds = new Set<number>();
        let uniqueCategoryIds = new Set<string>();
        // Lặp qua mảng và thêm giá trị vào Set
        courses.forEach((course: Course) => {
            uniqueCourseIds.add(course.getDataValue('id'));
        });
        categories.forEach((category: Category) => {
            const categoryId = category.getDataValue('categoryId');
            uniqueCategoryIds.add(categoryId);
            dataRows[categoryId] = 0;
            categoryArray[category.id] = categoryId;
        });
        levels.forEach((level: Level) => {
            const levelId = level.getDataValue('id');
            uniqueLevelIds.add(levelId);
            dataRows[levelId] = 0;
        });
        // Init data matrix (all value = 0)
        for (const id of uniqueCourseIds) {
            matrixRcm[id] = {...dataRows};
        }
        // Create data matrix between course, level and category
        for(const course of courses) {
            const courseId = course.getDataValue('id');
            const levelId = course.getDataValue('levelId');
            const categoryId = course.getDataValue('categoryId');
            matrixRcm[courseId][levelId] = 1;
            matrixRcm[courseId][categoryArray[categoryId]] = 1;
        }
        return matrixRcm;
    }

    async getUserData(userId: number) {
        // Dựa vào các khoá học đã mua, hoặc yêu thích, hoặc đánh giá(Review, favorites, enrollments, carts)
        // Khoá học đã mua : 2 điểm
        // Khoá học đã đánh giá : theo điểm đã đánh gía
        // Khoá học yêu thích : 5d
        const userData = await this.userRepository.getDataUserForRecommended(userId);
        const userRateMap = new Map<number, number>(); // Mỗi khoá học sẽ có 1 điểm số duy nhất
        for (const course of userData.carts) {
            userRateMap.set(course.getDataValue('id'), this.inCartPoint);
        }

        for (const course of userData.favorites) {
            userRateMap.set(course.getDataValue('id'), this.favoritePoint);
        }

        for (const item of userData.enrollments) {
            userRateMap.set(item.getDataValue('courseId'), this.enrollmentPoint);
        }

        for (const review of userData.reviews) {
            userRateMap.set(review.getDataValue('courseId'), review.getDataValue('rating'));
        }

        return Array.from(userRateMap);
    }
}