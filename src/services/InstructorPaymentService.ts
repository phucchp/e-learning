import { Inject, Service } from 'typedi';
import { InstructorPayment } from '../models/InstructorPayment';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { InstructorPaymentRepository } from '../repositories/InstructorPaymentRepository';
import { IInstructorPaymentRepository } from '../repositories/interfaces/IInstructorPaymentRepository';
import { IInstructorPaymentService } from './interfaces/IInstructorPaymentService';
import { Op } from 'sequelize';

@Service()
export class InstructorPaymentService implements IInstructorPaymentService {

    @Inject(() => InstructorPaymentRepository)
	private instructorPaymentRepository!: IInstructorPaymentRepository;

    async getInstructorPayments(req: Request): Promise<{ rows: InstructorPayment[]; count: number}> {
        // Sort: id, instructorId, amount, time create
        // Filter by : instructorId, payoutBatchId, transactionStatus, Month + year,  receiver, isTransfer
        const whereCondition: any = {};
        let { search, instructorId, payoutBatchId, transactionStatus,payForYear, payForMonth, receiver, isTransfer, sort,sortType , page, pageSize} = req.query;
        if(instructorId){
            whereCondition['instructorId'] = {[Op.eq]: instructorId};
        }

        if(payoutBatchId){
            whereCondition['payoutBatchId'] = {[Op.eq]: payoutBatchId};
        }

        if(transactionStatus){
            whereCondition['transactionStatus'] = {[Op.eq]: transactionStatus};
        }

        if(payForMonth){
            whereCondition['payForMonth'] = {[Op.eq]: payForMonth};
        }

        if(payForYear){
            whereCondition['payForYear'] = {[Op.eq]: payForYear};
        }

        if(receiver){
            whereCondition['receiver'] = {[Op.eq]: receiver};
        }

        if(isTransfer){
            whereCondition['isTransfer'] = {[Op.eq]: isTransfer};
        }

        const options = {
            page: page || 1,
            pageSize: pageSize || 10,
            whereCondition: whereCondition,
            sortType: sortType || 'ASC',
            sort : sort || 'createdAt'
        }

        return await this.instructorPaymentRepository.getAllInstructorPayment(options);
    }
    
    async getInstructorPayment(instructorPaymentId: number): Promise<InstructorPayment> {
        // Trả về thêm các payment details nữa
        throw new Error('Method not implemented.');
    }
    
    async createInstructorPayment(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<InstructorPayment> {
        throw new Error('Method not implemented.');
    }
    
    async updateInstructorPayment(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<InstructorPayment> {
        throw new Error('Method not implemented.');
    }
    
    async deleteInstructorPayment(instructorPaymentId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
