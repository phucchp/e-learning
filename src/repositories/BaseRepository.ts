import { Model, ModelCtor } from 'sequelize-typescript';
import { BaseRepositoryInterface } from './interfaces/BaseRepositoryInterface';

class BaseRepository<T extends Model<T>> implements BaseRepositoryInterface<T> {
    protected model: ModelCtor<T>;

    constructor(model: ModelCtor<T>) {
        this.model = model;
    }
  
    async getAll(options?: any): Promise<T[]> {
        return this.model.findAll(options);
    }

    async getById(id: number, options?: any): Promise<T | null> {
        return this.model.findByPk(id, options);
    }

    async create(entity: any): Promise<T> {
        return await this.model.create(entity);
    }

    async update(id: number, entity: any): Promise<[number, T[]]> {
        return this.model.update(entity, { where: { id } as any, returning: true }) as any; // Adjust the type here
    }

    async delete(id: number, force: boolean = false): Promise<number> {
        try {
            const result = await this.model.destroy({ where: { id } as any, force });
            return result;
        } catch (error) {
            throw error;
        }
    }
    
}

export { BaseRepository };
