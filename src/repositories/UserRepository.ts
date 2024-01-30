import { Service } from "typedi";
import { User } from "../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";
import { BaseRepository } from "./BaseRepository";
import { Course } from "../models/Course";
import { Language } from "../models/Language";
import { Level } from "../models/Level";
import { Category } from "../models/Category";
import { Op } from 'sequelize';

@Service()
export class UserRepository extends BaseRepository<User> implements IUserRepository{

    constructor(){
		super(User);
	}

	async getCarts(userId: number, search: string): Promise<{ rows: User[]; count: number; }> {

		const result = await this.model.findAndCountAll({
			where: {
				id: userId,
			},
			attributes: ['userName', 'email'],
			include:[
				{
					model: Course,
					as: 'carts',
					attributes: { exclude: ['id', 'deletedAt', 'subUrl', 'isActive', 'instructorId', 'trailerUrl', 
					'requirementsDescription', 'learnsDescription', 'levelId', 'categoryId', 'languageId'] },
					where:{
						title: { [Op.iLike]: `%${search}%` }
					},
					through: {
						attributes: []
					},
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
						}
					],
				}
			],
		});
		return result;
	}
}