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
import { StatisticalRepository } from '../repositories/StatisticalRepository';
import { IStatisticalRepository } from '../repositories/interfaces/IStatisticalRepository';
import { PaypalService } from './PaypalService';
import { InstructorPaymentRepository } from '../repositories/InstructorPaymentRepository';
import { IInstructorPaymentRepository } from '../repositories/interfaces/IInstructorPaymentRepository';
import { InstructorPayment } from '../models/InstructorPayment';

@Service()
export class PaymentService implements IPaymentService {
    
    @Inject(() => PaymentRepository)
	private paymentRepository!: IPaymentRepository;

    @Inject(() => PaymentDetailRepository)
	private paymentDetailRepository!: IPaymentDetailRepository;

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => StatisticalRepository)
	private statisticalRepository!: IStatisticalRepository;

    @Inject(() => PaypalService)
	private paypalSerivce!: PaypalService;

    @Inject(() => InstructorPaymentRepository)
	private instructorPaymentRepository!: IInstructorPaymentRepository;

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
        const newPayment =  await this.paymentRepository.updateInstance(payment);
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
        await this.paymentRepository.deleteInstance(paymentNotCheckout);

    }

    chunkArray(array:any[], chunkSize: number) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    createDataForTransferMoney(data: any[]) {
        const items =[];
        for(const item of data) {
            let price = item.sum * (1-0.4);
            items.push({
                amount: {
                  value: `${parseFloat(price.toFixed(2))}`,
                  currency: 'USD',
                },
                sender_item_id: `${item.id}`,
                recipient_wallet: 'PAYPAL',
                receiver: `${item.paymentmail}`,
            });
        }
        return items;
    }

    getPreviousMonthYear() {
        const currentDate = new Date();
        let month = currentDate.getMonth();
        let year = currentDate.getFullYear();
    
        // Giảm tháng đi 1
        month--;
    
        // Nếu tháng là tháng 0 (tháng 1) thì chuyển sang năm trước đó
        if (month < 0) {
            month = 11; // Tháng 12
            year--;
        }
    
        return { month: month + 1, year }; // Trả về tháng và năm trước đó
    }

    async paymentMonthlyRevenueForInstructor(): Promise<any> {
        // Get % chiết khấu từ db
        // Lấy kết quả từ hàm thanh toán trả về và gửi mail cho từng instructor
        // Sau khi thanh toans xong gui mail cho user
        // Lấy kết quả từ bảng đã pay or lưu kết quả và export ra CSV
         // Upload CSV lên S3
         // Update lại trong payment or payment detail để biết những đơn đó đã được pay ( thêm cột ) -> Để gọi API này lần nữa sẽ kh dc
        const data = await this.statisticalRepository.calculateMonthlyRevenueByInstructor();
        // Get tháng và năm thanh toán (trước tháng hiện tại)
        const {month,year} = this.getPreviousMonthYear();
        // check data null -> Đã tạo batch
        if(!data || data.length === 0) {
            throw new NotFound('Already create batch or no payment this month to transfer!');
        }
        const items = this.createDataForTransferMoney(data);
        const responeData = await this.paypalSerivce.transferMoney(items);
        const responseDataBatch = await this.paypalSerivce.getBatchPayoutDetails(responeData.batch_header.payout_batch_id);
        // Update status payment details để biết những đơn nào đã tạo batch
        for(const item of data) {
            await this.paymentDetailRepository.updateStatusTransfer(item.list_payment_details_id);
        }
        // Tạo data bảng pay từ data trả về với status là pending -> Đó check thành công sẽ update lại
        const dataTransfer: any[] = [];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        for(const item of responseDataBatch.items) {
            dataTransfer.push({
                instructorId: Number(item.payout_item.sender_item_id),
                amount: Number(item.payout_item.amount.value),
                discountPercentage: 40,
                batchStatus: responseDataBatch.batch_header.batch_status,
                transactionStatus: item.transaction_status,
                payoutBatchId: item.payout_batch_id,
                payoutItemId: item.payout_item_id,
                receiver: item.payout_item.receiver,
                isTransfer: false,
                payForMonth: month,
                payForYear: year,
            });
        }
        const rs = await this.instructorPaymentRepository.createInBulks(dataTransfer);

        return {
            rs,
            responseDataBatch
        };
    }

    /**
     * Get paid money of instructor for admin
     * @param req 
     */
    async getDataTransfer(req: Request): Promise<{ rows: InstructorPayment[]; count: number; }> {
        //
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const instructorId = req.query.instructorId || null;
        const month = req.query.month;
        const year = req.query.year;
        const whereCondition: any = {};
        if(instructorId) {
            whereCondition['instructorId'] = instructorId;
        }

        if(month) {
            whereCondition['payForMonth'] = month;
        }

        if(year) {
            whereCondition['payForYear'] = year;
        }

        // kiểm tra kêt quả trả về, xem những cái nào có status là Pending thì gọi API lên paypal check status
        return await this.instructorPaymentRepository.getDataTransfer({
            page, pageSize, whereCondition
        })
    }

}