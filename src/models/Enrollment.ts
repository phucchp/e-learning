// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Course } from './Course';
import { User } from './User';

@Table({
  tableName: 'enrollments',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Enrollment extends Model<Enrollment> {
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
    type: DataType.STRING(100),
    unique: 'compositeIndex'
  })
  courseId!: string;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
