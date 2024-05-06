import { Service } from "typedi";
import { Payment } from "../models/Payment";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";
import { BaseRepository } from "./BaseRepository";
import { PaymentDetail } from "../models/PaymentDetail";
import { Course } from "../models/Course";

@Service()
export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository{

    constructor(){
		super(Payment);
	}

	async getPaymentNotCheckoutInformation(userId: number): Promise<Payment| null> {
		return await this.model.findOne({
			where: {
				userId: userId,
				isPayment: false
			},
			include: [
				{
					model: PaymentDetail,
					include: [
						{
							model: Course
						}
					]
				}
			]
		})
	}

    async getPaymentByTransactionId(transactionId: string): Promise<Payment| null>{
		return await this.model.findOne({
			where: {
				transactionId: transactionId,
				isPayment: false
			},
			include: [
				{
					model: PaymentDetail,
				}
			]
		})
	}

	async getPaymentOfUser(userId: number): Promise<{ rows: Payment[]; count: number; }> {
		return await this.model.findAndCountAll({
			where : {
				isPayment: true,
				userId: userId
			}
		});
	}

}