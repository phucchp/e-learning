import { Service } from "typedi";
import { PaymentDetail } from "../models/PaymentDetail";
import { IPaymentDetailRepository } from "./interfaces/IPaymentDetailRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class PaymentDetailRepository extends BaseRepository<PaymentDetail> implements IPaymentDetailRepository{

    constructor(){
		super(PaymentDetail);
	}

	async createMultiple(data: any): Promise<PaymentDetail[]> {
		return await this.model.bulkCreate(data);
	}

	async deletePaymentDetailsByPaymentId(paymentId: number): Promise<void> {
		await this.model.destroy({ 
			where: { paymentId: paymentId },
			force: true
		});
	}
}