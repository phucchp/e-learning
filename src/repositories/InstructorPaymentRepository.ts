import { Service } from "typedi";
import { InstructorPayment } from "../models/InstructorPayment";
import { IInstructorPaymentRepository } from "./interfaces/IInstructorPaymentRepository";
import { BaseRepository } from "./BaseRepository";
import { User } from "../models/User";
import { Profile } from "../models/Profile";

@Service()
export class InstructorPaymentRepository extends BaseRepository<InstructorPayment> implements IInstructorPaymentRepository{

    constructor(){
		super(InstructorPayment);
	}

    async getAllInstructorPayment(options: any): Promise<{ rows: InstructorPayment[]; count: number; }> {
        const {page, pageSize, whereCondition, sort, sortType} = options;
        const offset = (page - 1) * pageSize;
        return await this.model.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    attributes: ['id','userName', 'email', 'roleId'],
                    include: [
                        {
                            model: Profile,
                        }
                    ]
                }
            ],
            limit: pageSize,
            offset: offset,
            order: [
                [sort, sortType],
                ['id', 'ASC']
            ]
        });
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