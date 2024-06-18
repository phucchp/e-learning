import { Inject, Service } from 'typedi';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';
import { RedisService } from './RedisService';

interface Row {
    [key: number]: number; // Định dạng cụ thể của các giá trị trong hàng
}

interface Matrix {
    [key: number]: Row; // Định dạng cụ thể của các hàng trong ma trận
}

@Service()
export class CollaborativeFiltering {

    @Inject(() => EnrollmentRepository)
	private enrollmentRepository!: IEnrollmentRepository;

    @Inject(() => RedisService)
	private redisService!: RedisService;

    private enrollmentPoint = 1;

    /**
     * Calculate similarity between two users
     */
    private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
        if (vectorA.length !== vectorB.length) {
            throw new Error("Vectors must be of the same length");
        }
    
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
    
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }
    
        if (normA === 0 || normB === 0) {
            return 0; // to handle cases where norm is 0 to avoid division by zero
        }
    
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Create full matrix between users and courses
     */
    async createMatrix(): Promise<any> {
        // 
        const cacheKey = 'CollaborativeFilteringMatrix';
        const cachedResult = await this.redisService.getCache(cacheKey);
        if (cachedResult) {
            // If cached data is available, return it
            return cachedResult;
        }
        let matrix: Matrix = {} ;
        const dataRows : Row = {};
        let uniqueCourseIds = new Set<number>();
        let uniqueUserIds = new Set<number>();
        const enrollments = await this.enrollmentRepository.getAll();
        for (const enrollment of enrollments) {
            // const userId = enrollment.getDataValue('userId');
            // const courseId = enrollment.getDataValue('courseId');
            uniqueCourseIds.add(enrollment.getDataValue('courseId'));
            uniqueUserIds.add(enrollment.getDataValue('userId'));
        }

        // Init row, all value = 0
        for (const courseId of uniqueCourseIds) {
            dataRows[courseId] = 0;
        }
        // Init matrix, all row = 0
        for (const userId of uniqueUserIds) {
            matrix[userId] = {...dataRows}; // Copy dataRows
        }
        // Init value for Matrix
        for (const enrollment of enrollments) {
            const userId = enrollment.getDataValue('userId');
            const courseId = enrollment.getDataValue('courseId');
            matrix[userId][courseId] = this.enrollmentPoint;
        }
        await this.redisService.setCache(cacheKey, {
            matrix: matrix,
            uniqueUserIds: uniqueUserIds,
            uniqueCourseIds: uniqueCourseIds
        }, 60 * 5);
        return {
            matrix: matrix,
            uniqueUserIds: uniqueUserIds,
            uniqueCourseIds: uniqueCourseIds
        };
    }

    async getUserSimilarityWights(userId: number) {
        const {matrix, uniqueUserIds, uniqueCourseIds} = await this.createMatrix();
        // console.log(matrix);
        // console.log(`UserId: ${userId}`)
        // console.log(`user unique id: ${Array.from(uniqueUserIds)}`);
        // console.log(`course unique id: ${Array.from(uniqueCourseIds)}`);

        const similarityWights : Row = {};
        const matrixUserRate : Matrix = {};
        const restMatrix: Matrix = {};
        const dataRowRest : Row = {};
        const dataRowUserRate : Row = {};
        const userVectorRate: Row = {};
        const userVectorRest: Row = {};
        // user vector
        const userVector: Row = matrix[userId];
        if(!userVector) {
            return null;
        }
        uniqueUserIds.delete(userId);
        // Init restMatrix and userRateMatrix
        for(const key in userVector) {
            if (userVector[key] === 0) {
                dataRowRest[key] = 0;
            } else{
                dataRowUserRate[key] = 0;
                userVectorRate[key] = userVector[key];
            }
        }
        // Init matrix, all row = 0
        for (const key of uniqueUserIds) {
            restMatrix[key] = {...dataRowRest}; // Copy dataRows
            matrixUserRate[key] = {...dataRowUserRate}; // Copy dataRows
        }
        // Init value for restMatrix and userRateMatrix
        for(const key in userVector) {
            if (userVector[key] === 0) {
                for(const id of uniqueUserIds) {
                    restMatrix[id][key] =  matrix[id][key];
                }
            } else{
                for(const id of uniqueUserIds) {
                    matrixUserRate[id][key] =  matrix[id][key];
                }
            }
        }
        // console.log('===REST MATRIX===');
        // console.log(restMatrix);
        // console.log(matrixUserRate);

        // Tính toán độ tương tự
        // Calculate similarity between userId with another users
        for (const id of uniqueUserIds) {
            similarityWights[id] = this.cosineSimilarity(this.rowToArray(matrixUserRate[id]), this.rowToArray(userVectorRate));
        }
        const restMatrixWeights: Matrix = {};
        // Nhân độ tương tự với rest matrix
        for(const rowKey in restMatrix) {
            if (restMatrix.hasOwnProperty(rowKey)) {
                const row: Row = restMatrix[rowKey];
                const multipliedRow: Row = {};

                for (const colKey in row) {
                    if (row.hasOwnProperty(colKey)) {
                        multipliedRow[colKey] = row[colKey] * (similarityWights[rowKey] || 0);
                    }
                }

                restMatrixWeights[Number(rowKey)] = multipliedRow;
            }
        }
        // console.log('===REST MATRIX WITH WEIGHT===');
        // console.log(restMatrixWeights);
        const sumWeightSimilarity: Row = {...dataRowRest};
        const sumWeightCourses: Row = {...dataRowRest};
        const recommendMatrix: Row = {};
        for(const rowKey in restMatrix) {
            const row: Row = restMatrix[rowKey];
            for (const colKey in row) {
                if (row[colKey] === 0) {
                    sumWeightCourses[colKey] += row[colKey];
                }else{
                    sumWeightSimilarity[colKey] += similarityWights[rowKey];
                    sumWeightCourses[colKey] += row[colKey];
                }
            }
        }
        // console.log(sumWeightCourses);
        // console.log(sumWeightSimilarity);

        for(const key in sumWeightSimilarity) {
            recommendMatrix[key] = sumWeightSimilarity[key] * sumWeightCourses[key];
        }
        // console.log('RESULTS');
        // console.log(recommendMatrix);

        // Sort matrix
        const sortMatrix = this.sortArrayByValue(recommendMatrix);
        // console.log('RESULTS SORT');
        // console.log(sortMatrix);
        const courseIdsArr: number[] = sortMatrix.map(([key]) => key);
        // console.log(courseIdsArr);

        return courseIdsArr;

    }

    private sortArrayByValue(sumByKey: { [key: number]: number }): [number, number][] {
        return Object.entries(sumByKey)
            .map(([key, value]) => [Number(key), value] as [number, number])
            .sort((a, b) => b[1] - a[1]);
    }

    private rowToArray(row: Row) {
        const arr = [];
        for(const key in row) {
            arr.push(row[key]);
        }

        return arr;
    }
}
