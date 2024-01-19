// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey } from 'sequelize-typescript';
import { User } from './User';
import { Course } from './Course';

@Table({
  tableName: 'carts',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Cart extends Model<Cart> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  userId!: number;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  courseId!: number;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
