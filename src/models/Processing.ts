// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey } from 'sequelize-typescript';
import { User } from './User';
import { Lesson } from './Lesson';

@Table({
  tableName: 'processing',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Processing extends Model<Processing> {
  
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  userId!: number;

  @ForeignKey(() => Lesson)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  lessonId!: number;
  
  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
