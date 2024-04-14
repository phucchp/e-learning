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
import { PaymentDetailRepository } from '../repositories/PaymentDetailRepository';

@Service()
export class PaymentService implements IPaymentService {
    
    @Inject(() => PaymentRepository)
	private paymentRepository!: IPaymentRepository;

    @Inject(() => PaymentDetailRepository)
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
        courseIds: string[]
    ): Promise<Payment> {
        const paymentDetails: any = [];
        let totalPrice = 0;
        // Get courses to create payment details
        const courses = await this.courseRepository.getAll({
            where: {
                courseId: {
					[Op.in]:courseIds
				}
            }
        });

        for(const course of courses) {
            const price = course.price - course.price * course.discount/100;
            totalPrice += parseFloat(price.toFixed(2));
            paymentDetails.push({
                courseId: course.id,
                price: parseFloat(price.toFixed(2)),
                discount: course.discount,
            });
        }

        if(price !== totalPrice) {
            console.log('Error: price payment is not equal to total price');
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
        let paymentDetailsData = paymentDetails.map(function(paymentDetails: any) {
            return {
              ...paymentDetails,
              paymentId: payment.id
            };
        });
        // Create payment details
        const paymentDetailList = await this.paymentDetailRepository.createMultiple(paymentDetailsData);
       
        return payment;
    }

    async updatePayment(payment: Payment): Promise<Payment> {
        const newPayment =  await this.paymentRepository.updateInstace(payment);
        if(!newPayment) {
            throw new ServerError('Error updating payment!');
        }
        return newPayment;
    }

    async deletePayment(paymentId: number): Promise<void> {
        await this.paymentRepository.delete(paymentId, true);
    }

    async createPaymentDetails(paymentId: number, courseIds: number[]): Promise<PaymentDetail[]> {
        throw new Error('Method not implemented.');
    }

    /**
     * Return payment not checkout without payment details
     * @param userId 
     * @returns 
     */
    async getPaymentNotCheckout(userId: number): Promise<Payment | null> {
        return await this.paymentRepository.findOneByCondition({
            userId: userId,
            isPayment: false
        });
    }

    /**
     * Return payment not checkout with payment details
     * @param userId 
     * @returns 
     */
    async getPaymentNotCheckoutInformation(userId: number): Promise<Payment | null> {
        const payment = await this.paymentRepository.getPaymentNotCheckoutInfomation(userId);
        return payment;
    }

    /**
     * Get payment with payment details by transactionId
     * @param userId 
     * @returns 
     */
    async getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
        const payment = await this.paymentRepository.getPaymentByTransactionId(transactionId);
        return payment;
    }

    async cancelOrder(userId: number): Promise<void> {
        const paymentNotCheckout = await this.getPaymentNotCheckout(userId);
        if(!paymentNotCheckout) {
            throw new NotFound('No order to cancel.');
        }
        // Remove order details of order
        await this.paymentDetailRepository.deletePaymentDetailsByPaymentId(paymentNotCheckout.id);
        // Remove order
        await this.paymentRepository.deleteInstace(paymentNotCheckout);

    }
}