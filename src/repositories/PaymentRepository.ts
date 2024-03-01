import { Service } from "typedi";
import { Payment } from "../models/Payment";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";
import { BaseRepository } from "./BaseRepository";
import { PaymentDetail } from "../models/PaymentDetail";

@Service()
export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository{

    constructor(){
		super(Payment);
	}

}