import { Service } from "typedi";
import { Enrollment } from "../models/Enrollment";
import { IEnrollmentRepository } from "./interfaces/IEnrollmentRepository";
import { BaseRepository } from "./BaseRepository";
import { Course } from "../models/Course";

@Service()
export class EnrollmentRepository extends BaseRepository<Enrollment> implements IEnrollmentRepository{

    constructor(){
		super(Enrollment);
	}

	async getEnrollmentCourses(userId: number, options: any): Promise<{ rows: Enrollment[]; count: number; }> {
		return await this.model.findAndCountAll({
			where:{
				userId: userId
			},
			include: [
				{
					model: Course,
					attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
				}
			]
		});
	}
}