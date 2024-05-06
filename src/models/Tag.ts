import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, HasMany } from 'sequelize-typescript';
import { CourseTag } from './CourseTag';

@Table({
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
  underscored: true, // Sử dụng naming convention snake_case
})
export class Tag extends Model<Tag> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @Column(DataType.STRING)
  tagId!: string;

  @Unique
  @Column(DataType.STRING)
  name!: string;

  @HasMany(() => CourseTag)
  courseTags!: CourseTag[];

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
