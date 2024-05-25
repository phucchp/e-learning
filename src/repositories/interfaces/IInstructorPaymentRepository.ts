import { InstructorPayment } from "../../models/InstructorPayment";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IInstructorPaymentRepository extends BaseRepositoryInterface<InstructorPayment> {
    createInBulks(data:any[]): Promise<InstructorPayment[]>;
    getAllInstructorPayment(data:any): Promise<{ rows: InstructorPayment[]; count: number; }>;
    getDataTransfer(options: any): Promise<{ rows: InstructorPayment[]; count: number; }>;
}