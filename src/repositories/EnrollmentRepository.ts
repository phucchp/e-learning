import { Service } from "typedi";
import { Enrollment } from "../models/Enrollment";
import { IEnrollmentRepository } from "./interfaces/IEnrollmentRepository";
import { BaseRepository } from "./BaseRepository";
import { Course } from "../models/Course";
import { Language } from "../models/Language";
import { Level } from "../models/Level";
import { Category } from "../models/Category";
import { Profile } from "../models/Profile";
import { User } from "../models/User";

@Service()
export class EnrollmentRepository extends BaseRepository<Enrollment> implements IEnrollmentRepository{

    constructor(){
		super(Enrollment);
	}

	async getEnrollmentCourses(userId: number, options: any): Promise<{ rows: Enrollment[]; count: number; }> {
		const {page, pageSize, whereCondition, sort, sortType} = options;
        const offset = (page - 1) * pageSize;
		return await this.model.findAndCountAll({
			where:{
				userId: userId
			},
			include: [
				{
					model: Course,
					attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
					where: whereCondition,
					include: [
						{
							model: Language,
							attributes: { exclude: ['id','createdAt', 'updatedAt', 'deletedAt'] },
						},
						{
							model: Level,
							attributes: { exclude: ['id','createdAt', 'updatedAt', 'deletedAt'] },
						},
						{
							model: Category,
							attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'] },
						},
						{
							model: User,
							as: 'instructor', // Alias của BelongsTo
							attributes: ['userName'],
							include: [
								{
									model: Profile,
									attributes: ['fullName', 'avatar'],
								},
							], 
						},
					]
				}
			],
			limit: pageSize,
            offset: offset,
            order: [
                [sort, sortType],
                ['createdAt', 'ASC']
            ]
		});
	}

	async createMultiple(data: any): Promise<Enrollment[]> {
		return await this.model.bulkCreate(data);
	}

	async getEnrollmentCoursesOfUser(userId: number): Promise<{ rows: Enrollment[]; count: number; }> {
		return await this.model.findAndCountAll({
			where:{
				userId: userId
			},
		});
	}
}