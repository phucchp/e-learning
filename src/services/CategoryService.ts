import { Inject, Service } from 'typedi';
import { ICategoryService } from './interfaces/ICategoryService';
import { Category } from '../models/Category';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError, handleErrorFunction } from '../utils/CustomError';
import * as crypto from 'crypto';

@Service()
export class CategoryService implements ICategoryService {

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    private generateCategoryId(name: string): string {
        // Chuyển tên thành viết thường và thêm dấu gạch ngang
        const lowerCaseName = name.toLowerCase();
        const dashedName = lowerCaseName.replace(/\s+/g, '-');
      
        // Tạo mã hash SHA-256 từ tên đã được xử lý
        const hash = crypto.createHash('sha256');
        const hashedCategoryId = hash.update(dashedName).digest('hex').slice(0,8);
      
        // Kết hợp tên đã xử lý và mã hash để tạo categoryId
        return `${dashedName}-${hashedCategoryId}`;
      }

    async getAll(): Promise<Category[]> {
        try{
            const categories = await this.categoryRepository.getAll();
            return categories;
        }catch(error){
            throw(error);
        }
    }

    async getCategory(categoryId: string): Promise<Category> {
        try{
            const category = await this.categoryRepository.findOneByCondition({
                categoryId: categoryId
            },
            ['id','deletedAt']
            );
            if(category){
                return category;
            }
            throw new ContentNotFound('Category not found!');
        }catch(error){
            console.log(error);
            throw new ServerError('Server Error!');
        }
    }

    async createCategory(req: Request): Promise<Category> {
        try{
            const {name} =req.body;
            const category = await this.categoryRepository.findOneByCondition({
                name : name
            },[], true);
            if(category){
                throw new RecordExistsError('Category already exists');
            }
            const categoryId = this.generateCategoryId(name);
            const newCategory = await this.categoryRepository.create({
                categoryId: categoryId,
                name: name
            });
            return newCategory; 
        }catch(error){
            console.log(error);
            handleErrorFunction(error);
        }
    }

    async updateCategory(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Category> {
        try{
            const {name} =req.body;
            const categoryId = req.params.categoryId;
            const category = await this.categoryRepository.findOneByCondition({
                categoryId: categoryId
            });
            if(category) {
                const checkName  = await this.categoryRepository.findOneByCondition({
                    name : name
                },[], true);
                if(checkName){
                    throw new RecordExistsError('Category name already exists');
                }
                const newCategory = await this.categoryRepository.update(category.getDataValue('id'),{
                    name: name
                });
                if(newCategory){
                    return newCategory;
                }
                throw new ContentNotFound('Faild');
            }
            throw new ContentNotFound('Category not found!');
        }catch(error){
            console.log(error);
            handleErrorFunction(error);
        }
    }

    async deleteCategory(categoryId: string): Promise<void> {
        try{
            const category = await this.categoryRepository.findOneByCondition({
                categoryId: categoryId
            });
            if(category){
                await this.categoryRepository.delete(category.getDataValue('id'));
                return;
            }
            throw new ContentNotFound('Category not found!');
        }catch(error){
            console.log(error);
            handleErrorFunction(error);
        }
    }
}