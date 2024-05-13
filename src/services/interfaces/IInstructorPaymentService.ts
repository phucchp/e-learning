import { InstructorPayment } from "../../models/InstructorPayment";
import { Request} from 'express';

export interface IInstructorPaymentService {
    getInstructorPayments(req: Request): Promise<{ rows: InstructorPayment[]; count: number}>;
    getInstructorPayment(instructorPaymentId: number): Promise<InstructorPayment>;
    updateInstructorPayment(req: Request): Promise<InstructorPayment>;
    deleteInstructorPayment(instructorPaymentId: number): Promise<void>;
}