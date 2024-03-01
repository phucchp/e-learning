import { Inject, Service } from 'typedi';
import { IPaymentService } from './interfaces/IPaymentService';
import { Payment } from '../models/Payment';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { IPaymentRepository } from '../repositories/interfaces/IPaymentRepository';
import { Op } from 'sequelize';
import { IPaymentDetailRepository } from '../repositories/interfaces/IPaymentDetailRepository';
import { PaymentDetail } from '../models/PaymentDetail';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';

@Service()
export class PaymentService implements IPaymentService {
    
    @Inject(() => PaymentRepository)
	private paymentRepository!: IPaymentRepository;

    @Inject(() => PaymentRepository)
	private paymentDetailRepository!: IPaymentDetailRepository;

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    async getPayments(): Promise<Payment[]> {
        throw new Error('Method not implemented.');
    }

    async getPayment(paymentId: string): Promise<Payment> {
        throw new Error('Method not implemented.');
    }

    async createPayment(
        userId: number,
        price: number,
        paymentMethod: string,
        transactionId: string,
        orderInfor: string,
        status: string,
        courseIds: number[]
    ): Promise<Payment> {
        const paymentDetails: any = [];
        let totalPrice = 0;
        const paymentId = 1;
        
        // Get courses to create payment details
        const courses = await this.courseRepository.getAll({
            where: {
                courseId: {
					[Op.in]:courseIds
				}
            }
        });

        for(const course of courses) {
            totalPrice = totalPrice + course.price * (course.price - course.discount/100);
            paymentDetails.push({
                courseId: course.id,
                price: course.price,
                discount: course.discount,
            });
        }

        // Create payment
        const payment = await this.paymentRepository.create({
            userId: userId,
            price: totalPrice,
            paymentMethod: paymentMethod,
            transactionId: transactionId,
            orderInfor: orderInfor,
            status: status,
            isPayment: false,
        });

        if(!payment) {
            throw new ServerError('Server error!');
        }

        // Add paymentId key to list payment details
        let paymentDetailsData = courses.map(function(paymentDetails) {
            return {
              ...paymentDetails,
              paymentId: payment.id
            };
        });
        
        // Create payment details
        await this.paymentDetailRepository.createMultiple(paymentDetailsData);
        return payment;
    }

    async updatePayment(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Payment> {
        throw new Error('Method not implemented.');
    }

    async deletePayment(paymentId: number): Promise<void> {
        await this.paymentRepository.delete(paymentId, true);
    }

    async createPaymentDetails(paymentId: number, courseIds: number[]): Promise<PaymentDetail[]> {
        throw new Error('Method not implemented.');
    }

    async getPaymentNotCheckout(userId: number): Promise<Payment | null> {
        return await this.paymentRepository.findOneByCondition({
            userId: userId,
            isPayment: false
        });
    }

}