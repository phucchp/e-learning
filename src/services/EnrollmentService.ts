import { Inject, Service } from 'typedi';
import { IEnrollmentService } from './interfaces/IEnrollmentService';
import { Enrollment } from '../models/Enrollment';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';

@Service()
export class EnrollmentService implements IEnrollmentService {

    @Inject(() => EnrollmentRepository)
	private enrollmentRepository!: IEnrollmentRepository;

    async getEnrollmentCourses(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<{ rows: Enrollment[]; count: number; }> {
        const userId = 1 ;
        const options:any = {};
        return await this.enrollmentRepository.getEnrollmentCourses(userId, options);
    }

}