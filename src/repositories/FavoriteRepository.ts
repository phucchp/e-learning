import { Service } from "typedi";
import { Favorite } from "../models/Favorite";
import { IFavoriteRepository } from "./interfaces/IFavoriteRepository";
import { BaseRepository } from "./BaseRepository";
import { Category } from "../models/Category";
import { Course } from "../models/Course";
import { Language } from "../models/Language";
import { Level } from "../models/Level";
import { User } from "../models/User";
import { Profile } from "../models/Profile";

@Service()
export class FavoriteRepository extends BaseRepository<Favorite> implements IFavoriteRepository{

    constructor(){
		super(Favorite);
	}

	async getCoursesFavorite(userId: number, options: any): Promise<{ rows: Favorite[]; count: number; }> {
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
}