import { Service } from "typedi";
import { Category } from "../models/Category";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";
import { BaseRepository } from "./BaseRepository";
import { Course } from "../models/Course";

@Service()
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository{

    constructor(){
		super(Category);
	}

	async getCourseByCategory(): Promise<Category[]> {
		return await this.model.findAll({
			include: [
                {
                    model: Course,
                    attributes: { exclude: ['id','createdAt','trailerUrl','subUrl', 'updatedAt', 'deletedAt', 'learnsDescription', 'requirementsDescription', 'description'] },
					limit : 10
                }
			]
		});
	}
}