import { Inject, Service } from 'typedi';
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
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';

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

        return {
            matrix: matrix,
            uniqueUserIds: uniqueUserIds,
            uniqueCourseIds: uniqueCourseIds
        };
    }

    async getUserSimilarityWights(userId: number) {
        const {matrix, uniqueUserIds, uniqueCourseIds} = await this.createMatrix();
        const similarityWights : Row = {};
        const matrixUserRate : Matrix = {};
        const restMatrix: Matrix = {};
        const dataRowRest : Row = {};
        const dataRowUserRate : Row = {};
        // user vector
        const userVector: Row = matrix[userId];
        if(!userVector) {
            return null;
        }
        uniqueUserIds.delete(userId);

        for(const key in userVector) {
            if (userVector[key] === 0) {
                dataRowRest[key] = 0;
                for(const id of uniqueUserIds) {
                    restMatrix[id][key] =  matrix[id][key];
                }
            } else{
                dataRowUserRate[key] = 0;
                for(const id of uniqueUserIds) {
                    matrixUserRate[id][key] =  matrix[id][key];
                }
            }
        }

        // Tính toán độ tương tự
        // Calculate similarity between userId with another users
        for (const id of uniqueUserIds) {
            similarityWights[id] = this.cosineSimilarity(this.rowToArray(matrixUserRate[id]), this.rowToArray(userVector));
        }
        const restMatrixWeights: Matrix = {};
        // Nhân độ tương tự với rest matrix
        for(const rowKey in restMatrix) {
            if (matrix.hasOwnProperty(rowKey)) {
                const row: Row = matrix[rowKey];
                const multipliedRow: Row = {};

                for (const colKey in row) {
                    if (row.hasOwnProperty(colKey)) {
                        multipliedRow[colKey] = row[colKey] * (similarityWights[rowKey] || 0);
                    }
                }

                restMatrixWeights[Number(rowKey)] = multipliedRow;
            }
        }
        const sumWeightSimilarity: Row = {...dataRowRest};
        const sumWeightCourses: Row = {...dataRowRest};
        const recommendMatrix: Row = {};
        for(const rowKey in restMatrix) {
            const row: Row = matrix[rowKey];
            for (const colKey in row) {
                if (row[colKey] === 0) {
                    sumWeightCourses[colKey] += row[colKey];
                }else{
                    sumWeightSimilarity[colKey] += similarityWights[rowKey];
                    sumWeightCourses[colKey] += row[colKey];
                }
            }
        }

        for(const key in sumWeightSimilarity) {
            recommendMatrix[key] = sumWeightSimilarity[key] * sumWeightCourses[key];
        }

        // Sort matrix

    }

    private rowToArray(row: Row) {
        const arr = [];
        for(const key in row) {
            arr.push(row[key]);
        }

        return arr;
    }
}
