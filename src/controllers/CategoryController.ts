import { CategoryService } from "../services/CategoryService";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { NotFound } from "../utils/CustomError";
import { HandleS3 } from "../services/utils/HandleS3";

export class CategoryController{
	private categoryService: ICategoryService;
	private handleS3: HandleS3;

	constructor() {
		this.categoryService = Container.get(CategoryService);
		this.handleS3 = Container.get(HandleS3);
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

    getCourseByCategory = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getCourseByCategory();
        for(const category of categories) {
            category.setDataValue('courses', await this.handleS3.getResourceCourses(category.courses));
        }
        return res.status(200).json({
            message: "success",
            data: categories
        });
    }

}