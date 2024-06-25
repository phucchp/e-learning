import { Service } from "typedi";
import { User } from "../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";
import { BaseRepository } from "./BaseRepository";
import { Course } from "../models/Course";
import { Language } from "../models/Language";
import { Level } from "../models/Level";
import { Category } from "../models/Category";
import { Op } from 'sequelize';
import { NotFound } from "../utils/CustomError";
import { Profile } from "../models/Profile";
import { EWallet } from "../models/EWallet";
import { Enrollment } from "../models/Enrollment";
import { Review } from "../models/Review";

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

	async getFavoriteCourses(userId: number, search: string): Promise<{ rows: User[]; count: number; }> {
		const result = await this.model.findAndCountAll({
			where: {
				id: userId,
			},
			attributes: ['userName', 'email'],
			include:[
				{
					model: Course,
					as: 'favorites',
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

	async getUserInformation(userId: number): Promise<User> {
		const user = await this.model.findOne({
			where: {
				id: userId
			},
			attributes: { exclude: ['id','roleId','password','isActive','createdAt', 'updatedAt', 'deletedAt'] },
			include: [
				{
					model: Profile,
					attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
				}
			]
		});

		if(!user) {
			throw new NotFound('User not found');
		}
		return user;
	}

	async getListInstructors(page: number, pageSize: number): Promise<{ rows: User[]; count: number; }> {
        const offset = (page - 1) * pageSize;
		const results = await this.model.findAndCountAll({
			attributes: ['userName', 'id'],
			where: {
				roleId: {
					[Op.gte] : 2
				},
				isActive: true
			},
			include: [
				{
					model: Profile,
					attributes: ['fullName','firstName', 'lastName', 'avatar', 'description'] ,
				}
			],
			limit: pageSize,
            offset: offset,
			order:[
				['id', 'DESC']
			]
		});

		return results;
	}

	/**
	 * For admin
	 */
	async getUsers(options: any): Promise<{ rows: User[]; count: number; }> {
		const {page, pageSize, whereCondition, sort, sortType} = options;
		const offset = (page - 1) * pageSize;
		const results = await this.model.findAndCountAll({
			attributes: { exclude: ['password'] },
			where: whereCondition,
			include: [
				{
					model: Profile,
				}
			],
			limit: pageSize,
            offset: offset,
			order: [
                [sort, sortType],
            ]
		});

		return results;
	}

	/**
	 * For admin
	 */
	async getUser(userId: number): Promise<User> {
		const user = await this.model.findOne({
			where: {
				id: userId
			},
			attributes: { exclude: ['password'] },
			include: [
				{
					model: Profile,
				},
				{
					model: EWallet,
				}
			]
		});

		if(!user) {
			throw new NotFound('User not found');
		}
		return user;
	}

	/**
	 * Get data user for recommend
	 * @param userId 
	 * @returns 
	 */
	async  getDataUserForRecommended(userId: number): Promise<User>{
		const user = await this.model.findOne({
			where: {
				id: userId
			},
			attributes: { exclude: ['password'] },
			include:[
				{
					model: Course,
					as: 'favorites',
					attributes: ['id', 'courseId'] ,
					through: {
						attributes: []
					},
				},
				{
					model: Course,
					as: 'carts',
					attributes: ['id', 'courseId'] ,
					through: {
						attributes: []
					},
				},
				{
					model: Enrollment
				},
				{
					model: Review
				}
			]
		});

		if(!user) {
			throw new NotFound('User not found');
		}
		return user;
	}
}

