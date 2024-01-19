// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Lesson } from './Lesson';

@Table({
  tableName: 'notes',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Note extends Model<Note> {
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

  @ForeignKey(() => Lesson)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  lessonId!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  time!: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  content!: string

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Lesson)
  lesson!: User;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
