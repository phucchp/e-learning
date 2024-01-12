import { Inject, Service } from 'typedi';
import { ICategoryService } from './interfaces/ICategoryService';
import { Category } from '../models/Category';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';

@Service()
export class CategoryService implements ICategoryService {

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    async getAll(): Promise<Category[]> {
        try{
            const categories = await this.categoryRepository.getAll();
            return categories;
        }catch(error){
            throw(error);
        }
    }
}