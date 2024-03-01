import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, HasMany } from 'sequelize-typescript';
import { Course } from './Course';

@Table({
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
  underscored: true, // Sử dụng naming convention snake_case
})
export class Category extends Model<Category> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @Column(DataType.STRING)
  categoryId!: string;

  @Unique
  @Column(DataType.STRING)
  name!: string;

  @HasMany(() => Course)
  courses!: Course[];

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
