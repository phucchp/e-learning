import { CategoryService } from "../services/CategoryService";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { handleErrorController } from "../utils/CustomError";

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

    getCategory = async (req: Request, res: Response) => {
        try{
            const categoryId = req.params.categoryId;
            const category = await this.categoryService.getCategory(categoryId);
            return res.status(200).json({
                message: "success",
                data: category
            });
        }catch(error: any){
            handleErrorController(error,res);
        }
    }

    createCategory = async (req: Request, res: Response) => {
        try{
            const newCategory = await this.categoryService.createCategory(req);
            return res.status(200).json({
                message: "success",
                data: newCategory
            });
        }catch(error: any){
            handleErrorController(error,res);
        }
    }

    updateCategory = async (req: Request, res: Response) => {
        try{
            const newCategory = await this.categoryService.updateCategory(req);
            return res.status(200).json({
                message: "success",
                data: newCategory
            });
        }catch(error: any){
            handleErrorController(error,res);
        }
    }

    deleteCategory = async (req: Request, res: Response) => {
        try{
            const categoryId = req.params.categoryId;
            const newCategory = await this.categoryService.deleteCategory(categoryId);
            return res.status(200).json({
                message: "success",
                data: newCategory
            });
        }catch(error: any){
            handleErrorController(error,res);
        }
    }
}