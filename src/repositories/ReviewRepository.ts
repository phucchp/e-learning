import { Service } from "typedi";
import { Review } from "../models/Review";
import { IReviewRepository } from "./interfaces/IReviewRepository";
import { BaseRepository } from "./BaseRepository";
import { Profile } from "../models/Profile";
import { User } from "../models/User";

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
}