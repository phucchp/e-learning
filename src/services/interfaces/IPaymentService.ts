import { Payment } from "../../models/Payment";
import { Request} from 'express';
import { PaymentDetail } from "../../models/PaymentDetail";

export interface IPaymentService {
    getPayments(): Promise<Payment[]>;
    getPayment(paymentId: string): Promise<Payment>;
    createPayment(
        userId: number,
        price: number,
        paymentMethod: string,
        transactionId: string,
        orderInfor: string,
        status: string,
        courseIds: number[]
    ): Promise<Payment>;
    updatePayment(req: Request): Promise<Payment>;
    deletePayment(paymentId: number): Promise<void>;
    createPaymentDetails(paymentId: number, courseIds: number[]): Promise<PaymentDetail[]>;
    getPaymentNotCheckout(userId: number): Promise<Payment | null>;
}