import { Category } from "../../models/Category";
import { Request} from 'express';

export interface ICategoryService {
    getAll(): Promise<Category[]>;
    getCategory(categoryId: string): Promise<Category>;
    createCategory(req: Request): Promise<Category>;
    updateCategory(req: Request): Promise<Category>;
    deleteCategory(categoryId: string): Promise<void>;
}