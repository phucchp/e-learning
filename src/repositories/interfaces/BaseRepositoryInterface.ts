import { Model } from 'sequelize-typescript';

interface BaseRepositoryInterface<T extends Model<T>> {
  getAll(options?: any): Promise<T[]>;
  getById(id: number, options?: any): Promise<T | null>;
//   create(entity: Partial<T>): Promise<T>;
//   update(id: number, entity: Partial<T>): Promise<[number, T[]]>;
  delete(id: number): Promise<number>;
}

export { BaseRepositoryInterface };
