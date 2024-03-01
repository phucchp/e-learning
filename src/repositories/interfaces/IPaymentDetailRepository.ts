import { PaymentDetail } from "../../models/PaymentDetail";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IPaymentDetailRepository extends BaseRepositoryInterface<PaymentDetail> {
    createMultiple(data: any): Promise<PaymentDetail[]>;
}