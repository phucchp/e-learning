// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany } from 'sequelize-typescript';
import { Course } from './Course';

@Table({
  tableName: 'levels',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Level extends Model<Level> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  levelName!: string;

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
