import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Course } from './Course';
import { Lesson } from './Lesson';

@Table({
  tableName: 'topics',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Topic extends Model<Topic> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
  })
  name!: string;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  courseId!: number;

  @BelongsTo(() => Course)
  course!: Course;
  
  @HasMany(() => Lesson)
  lessons!: Lesson[];

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
