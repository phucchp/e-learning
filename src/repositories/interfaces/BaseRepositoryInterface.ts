import { Model } from 'sequelize-typescript';

interface BaseRepositoryInterface<T extends Model<T>> {
  getAll(options?: any): Promise<T[]>;
  findById(id: number, options?: any): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<number>;
  findOneByCondition(condition: any, options?: any, paranoid?:boolean): Promise<T | null>
}

export { BaseRepositoryInterface };
