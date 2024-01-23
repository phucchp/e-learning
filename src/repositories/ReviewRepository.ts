import { Service } from "typedi";
import { Review } from "../models/Review";
import { IReviewRepository } from "./interfaces/IReviewRepository";
import { BaseRepository } from "./BaseRepository";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { Sequelize } from 'sequelize-typescript';
@Service()
export class ReviewRepository extends BaseRepository<Review> implements IReviewRepository{

    constructor(){
		super(Review);
	}

	async getReviews(options: any): Promise<{ rows: Review[]; count: number }> {
		try{
			const {page, pageSize, whereCondition, sort, sortType} = options;
            const offset = (page - 1) * pageSize;
			const reviews = await this.model.findAndCountAll({
				attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
				where: whereCondition,
				limit: pageSize,
                offset: offset,
                order: [
                    [sort, sortType],
                ]
			});
			return reviews;
		}catch(error){
			throw(error);
		}
	}

	async getReviewsOfCourse(options: any): Promise<{ rows: Review[]; count: number }> {
		try{
			const {page, pageSize, whereCondition, sort, sortType} = options;
            const offset = (page - 1) * pageSize;
			const reviews = await this.model.findAndCountAll({
				attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
				where: whereCondition,
				include: [
					{
						model: User,
						include: [
							{
								model: Profile,
								attributes: ['fullName', 'avatar'],
							},
						],
						attributes: ['userName'], 
					}
				],
				limit: pageSize,
                offset: offset,
				distinct: true,
                order: [
                    [sort, sortType],
                ]
			});
			return reviews;
		}catch(error){
			throw(error);
		}
	}

	async getStatiscalReviews(courseId: number): Promise<{ rows: Review[]; count: any[]}> {
		try {
			const reviews = await this.model.findAndCountAll({
				where: {
					courseId:courseId
				},
				attributes: [
				  [Sequelize.fn('FLOOR', Sequelize.col('rating')), 'roundedRating'],
				  [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
				],
				group: [Sequelize.fn('FLOOR', Sequelize.col('rating'))],
				raw: true
			  });
			return reviews;
		} catch (error) {
			throw(error);
		}
	}
}