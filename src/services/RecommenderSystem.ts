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
    [key: number]: Row; // Định dạng cụ thể của các hàng trong ma trận
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
        return await this.getCourseIdsRecommend(146);
    }

    /**
     * Main function
     */
    async getCourseIdsRecommend(userId: number) {
        // Step 1 : Create full matrix between course, category and level
        // Step 2 : Get user data (include : course favorite, rating and course in cart) -> User rate map
        // Step 3 : Create matrix weights of user based on user rate map in Step 2
        // Step 4 : Create User Profile (Vector weight)
        // Step 5 : Get the restMatrix and calculate recommend matrix
        const matrix = await this.createMatrix();
        const userRateMap : Map<number, number> = await this.getUserData(userId);
        const restMatrix = await this.getTheRestMatrix(matrix, Array.from(userRateMap.keys()));
        const matrixWeight = await this.getUserRateMatrixWeight(matrix, userRateMap);
        let vectorWeight = await this.sumColumns(matrixWeight);
        vectorWeight = await this.normalizeArray(vectorWeight);
        const matrixRecommend = await this.getUserMatrixRecommend(restMatrix, vectorWeight);
        const courseIdsArr: number[] = matrixRecommend.map(([key]) => key);
        return courseIdsArr;
    }
    
    /**
     * Create full matrix between courses and categories
     */
    async createMatrix(): Promise<Matrix> {
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
            matrixRcm[courseId][levelId] = 0.2;
            matrixRcm[courseId][categoryArray[categoryId]] = 1;
        }
        return matrixRcm;
    }

    /**
     * Get user data for create matrix recommend
     * Include : courses that user reviewed, favorite , enrolled, add to cart
     * @param userId 
     * @returns 
     */
    async getUserData(userId: number): Promise<Map<number, number>> {
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

        return userRateMap;
    }

    /**
     * Get the rest matrix from the matrix and movieIds
     * Function will remove course with courseId in courseIds array 
     */
    public async getTheRestMatrix(matrix: Matrix, courseIds: number[]): Promise<Matrix> {
        const restMatrix: Matrix = {};
        const excludedCourseIdsSet = new Set(courseIds);

        for (const rowKey in matrix) {
            const row = matrix[rowKey];
            // const rowKey = Object.keys(row)[0]; // Lấy key của hàng
            const rowId = parseInt(rowKey, 10);
        
            // Check if courseId not in set -> push to matrix
            if (!excludedCourseIdsSet.has(rowId)) {
                restMatrix[rowKey] = row;
            }
        }
        return restMatrix;
    }

    /**
     * Get user matrix weights
     * @param matrix 
     * @param userRateMap 
     * @returns 
     */
    public async getUserRateMatrixWeight(matrix: Matrix, userRateMap: Map<number, number>): Promise<Matrix>
    {
        const matrixWeight: Matrix = {};
        userRateMap.forEach((value, key)=>{
            const multiplier = value;
            let row =matrix[key];
            const weightedRow: Row = {};
            for (const colKey in row) {
                if (row.hasOwnProperty(colKey)) {
                    weightedRow[colKey] = row[colKey] * value;
                }
            }
            matrixWeight[key] = weightedRow;
            
        });
        // console.log(this.sumColumns(matrixWeight));
        return matrixWeight;
    }

    /**
     * matrix normalization ( devide the total )
     * 
     * @param array 
     * @returns number[]
     */
    private normalizeArray(array: Row): Row {
        const values = Object.values(array);
        const sum = values.reduce((acc, value) => acc + value, 0);
        // console.log(`SUM VALUES: ${sum}`);
        // Create a new object to hold the normalized values
        const normalizedRow: Row = {};
    
        for (const key in array) {
            if (array.hasOwnProperty(key)) {
                normalizedRow[key] = array[key] / sum;
            }
        }
    
        return normalizedRow;
    }

    /**
     * Sum colum, output is a vector normalized
     * 
     * @param matrixWeight 
     * @returns number[]
     */
    private sumColumns(matrixWeight: Matrix): Row {
        
        // Khởi tạo mảng result với giá trị 0 cho mỗi cột
        const results: Row = Object.keys({...matrixWeight[1]}).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {} as Row);
        // Cộng giá trị của mỗi cột từ mỗi đối tượng trong mảng
        for (const rowKey in matrixWeight) {
            if (matrixWeight.hasOwnProperty(rowKey)) {
                const row: Row = matrixWeight[rowKey];

                for (const colKey in row) {
                    results[colKey] += Number(row[colKey]);
                }
            }
        }
        return results;
    }

    /**
     * Multiply the rest movies matrix by the user weight matrix
     * 
     * @param matrix the rest matrix (without movies favorite of user, movies user rated, movies user watched)
     * @param userWeight vector user weight matrix (by genres)
     * @returns [number, number][]
     */
    public getUserMatrixRecommend(matrix: Matrix, userWeight: Row): [number, number][] {
        const recommendedMatrix: Matrix = {};

        for (const rowKey in matrix) {
            if (matrix.hasOwnProperty(rowKey)) {
                const row = matrix[rowKey];
                const multipliedRow: Row = {};

                for (const colKey in row) {
                    if (row.hasOwnProperty(colKey)) {
                        multipliedRow[colKey] = row[colKey] * (userWeight[colKey] || 0);
                    }
                }

                recommendedMatrix[Number(rowKey)] = multipliedRow;
            }
        }
        // console.log(recommendedMatrix);

        const sumByKey: { [key: number]: number } = {};

        for (const rowKey in recommendedMatrix) {
            if (recommendedMatrix.hasOwnProperty(rowKey)) {
                const row = recommendedMatrix[Number(rowKey)];

                sumByKey[Number(rowKey)] = Object.values(row).reduce((acc, value) => acc + value, 0);
            }
        }
        // for (const key in sumByKey) {
        //     if (sumByKey.hasOwnProperty(key)) {
        //         console.log(`Row ${key}: ${sumByKey[key]}`);
        //     }
        // }

        return this.sortArrayByValue(sumByKey);
    }

    private sortArrayByValue(sumByKey: { [key: number]: number }): [number, number][] {
        return Object.entries(sumByKey)
            .map(([key, value]) => [Number(key), value] as [number, number])
            .sort((a, b) => b[1] - a[1]);
    }

}
