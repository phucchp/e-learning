// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Topic } from './Topic';
import { Course } from './Course';
import { User } from './User';

@Table({
  tableName: 'favorites',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Favorite extends Model<Favorite> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
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
