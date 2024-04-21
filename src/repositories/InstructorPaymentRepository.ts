import { Service } from "typedi";
import { InstructorPayment } from "../models/InstructorPayment";
import { IInstructorPaymentRepository } from "./interfaces/IInstructorPaymentRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class InstructorPaymentRepository extends BaseRepository<InstructorPayment> implements IInstructorPaymentRepository{

    constructor(){
		super(InstructorPayment);
	}

    async createInBulks(data:any[]): Promise<InstructorPayment[]> {
        return await this.model.bulkCreate(data);
    }

    async getDataTransfer(options: any): Promise<{ rows: InstructorPayment[]; count: number; }> {
        const {page, pageSize, whereCondition,} = options;
        const offset = (page - 1) * pageSize;
        return await this.model.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: offset,
            order: [
                ['id', 'ASC']
            ]
        });
    }
}