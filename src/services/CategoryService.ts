import { Inject, Service } from 'typedi';
import { ICategoryService } from './interfaces/ICategoryService';
import { Category } from '../models/Category';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { RedisService } from './RedisService';
import { HandleS3 } from './utils/HandleS3';

@Service()
export class CategoryService implements ICategoryService {
    

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;
    
    @Inject(() => RedisService)
	private redisService!: RedisService;

    @Inject(() => HandleS3)
	private handleS3!: HandleS3;
    
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
        const cacheKey = `getAllCategory`;
        const cacheResult = await this.redisService.getCache(cacheKey);
        if (cacheResult) {
            return cacheResult;
        }
        const categories = await this.categoryRepository.getAll();
        await this.redisService.setCache(cacheKey, categories, 10*60);
        return categories;
    }

    async getCourseByCategory(): Promise<Category[]> {
        const cacheKey = `getCourseByCategory`;
        const cacheResult = await this.redisService.getCache(cacheKey);
        if (cacheResult) {
            return cacheResult;
        }
        const categories = await this.categoryRepository.getCourseByCategory();
        for(const category of categories) {
            category.setDataValue('courses', await this.handleS3.getResourceCourses(category.courses));
        }
        // Sort categories by the number of courses
        categories.sort((a, b) => {
            const aCourseCount = a.courses ? a.courses.length : 0;
            const bCourseCount = b.courses ? b.courses.length : 0;
            return bCourseCount - aCourseCount;
        });
        await this.redisService.setCache(cacheKey, categories, 10*60);
        return categories;
    }

    async getCategory(categoryId: string): Promise<Category> {
        const category = await this.categoryRepository.findOneByCondition({
            categoryId: categoryId
        },
        ['id','deletedAt']
        );
        if(category){
            return category;
        }
        throw new NotFound('Category not found!');
    }

    async createCategory(req: Request): Promise<Category> {
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
        await this.redisService.clearAllCache();
        return newCategory; 
    }

    async updateCategory(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Category> {
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
                await this.redisService.clearAllCache();
                return newCategory;
            }
            throw new ContentNotFound('Faild');
        }
        throw new ContentNotFound('Category not found!');
    }

    async deleteCategory(categoryId: string): Promise<void> {
        const category = await this.categoryRepository.findOneByCondition({
            categoryId: categoryId
        });
        if(category){
            await this.categoryRepository.delete(category.getDataValue('id'));
            await this.redisService.clearAllCache();
            return;
        }
        throw new ContentNotFound('Category not found!');
    }
}