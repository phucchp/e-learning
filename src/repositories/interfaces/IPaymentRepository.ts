import { Payment } from "../../models/Payment";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IPaymentRepository extends BaseRepositoryInterface<Payment> {
}