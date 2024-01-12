import { Service } from "typedi";
import { Category } from "../models/Category";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository{

    constructor(){
		super(Category);
	}
}