// models/Course.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, ForeignKey, BelongsTo, AllowNull, NotEmpty } from 'sequelize-typescript';
import { Category } from './Category';
import { User } from './User';
import { Language } from './Language';
import { Level } from './Level';

@Table({
  tableName: 'courses',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Course extends Model<Course> {
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
    type: DataType.STRING(100),
  })
  courseId!: string;

  @NotEmpty
  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  title!: string;

  @NotEmpty
  @Column({
    type: DataType.TEXT,
  })
  introduction!: string | null;

  @Column({
    type: DataType.TEXT,
  })
  description!: string | null;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  price!: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  discount!: number;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  instructorId!: number;

  @BelongsTo(() => User)
  instructor!: User;

  @Default(0.0)
  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  averageRating!: number;

  @Column({
    type: DataType.STRING,
  })
  trailerUrl!: string | null;

  @Column({
    type: DataType.STRING,
  })
  posterUrl!: string | null;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalStudents!: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalLessons!: number;

  @ForeignKey(() => Language)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  languageId!: number;

  @BelongsTo(() => Language)
  language!: Language;

  @ForeignKey(() => Level)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  levelId!: number;

  @BelongsTo(() => Level)
  level!: Level;

  @Default(false)
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
