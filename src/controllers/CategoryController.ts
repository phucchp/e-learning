import { CategoryService } from "../services/CategoryService";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { NotFound, handleErrorController } from "../utils/CustomError";

export class CategoryController{
	private categoryService: ICategoryService;

	constructor() {
		this.categoryService = Container.get(CategoryService);
	}

    getCategories = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getAll();
        return res.status(200).json(categories);
    }

    getCategory = async (req: Request, res: Response) => {
        const categoryId = req.params.categoryId;
        const category = await this.categoryService.getCategory(categoryId);
        return res.status(200).json({
            message: "success",
            data: category
        });
    }

    createCategory = async (req: Request, res: Response) => {
        const newCategory = await this.categoryService.createCategory(req);
        return res.status(200).json({
            message: "success",
            data: newCategory
        });
    }

    updateCategory = async (req: Request, res: Response) => {
        const newCategory = await this.categoryService.updateCategory(req);
        return res.status(200).json({
            message: "success",
            data: newCategory
        });
    }

    deleteCategory = async (req: Request, res: Response) => {
        const categoryId = req.params.categoryId;
        const category = await this.categoryService.deleteCategory(categoryId);
        return res.status(200).json({
            message: "success",
            data: category
        });
    }
}