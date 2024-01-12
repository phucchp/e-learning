import { CategoryService } from "../services/CategoryService";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import Container from 'typedi';
import { Request, Response } from 'express';

export class CategoryController{
	private categoryService: ICategoryService;

	constructor() {
		this.categoryService = Container.get(CategoryService);
	}

    getCategories = async (req: Request, res: Response) => {
        try{
            const categories = await this.categoryService.getAll();
            return res.status(200).json(categories);
        }catch(error: any){
            return res.status(error.statusCode).json({
                message: "Server error!"
            })
        }
    }
}