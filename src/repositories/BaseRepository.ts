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

    /**
     * 
     * @param id 
     * @param paranoid : Default false, if paranoid = true will return soft delete record
     * @returns model
     */
    async findById(id: number, paranoid:boolean = false): Promise<T | null> {
        return this.model.findByPk(id, {
            paranoid: paranoid
        });
    }

    /**
     * 
     * @param id 
     * @param paranoid : Default true, if paranoid = false will return soft delete record
     * @returns model
     */
    async findOneByCondition(condition: any, options: any = [], paranoid:boolean = true): Promise<T | null> {
        return this.model.findOne({
            where: condition,
            attributes: { exclude: options },
            paranoid: paranoid
        });
    }

    async create(data: any): Promise<T> {
        return await this.model.create(data);
    }

    async update(id: number, updateFields: Partial<T>): Promise<T | null> {
        const instance = await this.model.findByPk(id);
        if (!instance) {
            return null;
        }
        await instance.update(updateFields);
        return instance;
      }

    /**
     * 
     * @param id 
     * @param force : default false (soft delete) , if force = true will delete all
     * @returns 
     */
    async delete(id: number, force: boolean = false): Promise<number> {
        const result = await this.model.destroy({ where: { id } as any, force });
        return result;
    }
    
    async deleteInstance(model: T, force: boolean = false): Promise<void> {
		await model.destroy({ force: force });
	}

    async updateInstance(instance: T): Promise<T | null> {
        await instance.save();
        return instance;
    }

    async restore(model: T): Promise<void> {
		return await model.restore();
	}
}


export { BaseRepository };
