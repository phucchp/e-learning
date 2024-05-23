import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Topic } from './Topic';
import { Course } from './Course';
import { Tag } from './Tag';

@Table({
  tableName: 'course_tags',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class CourseTag extends Model<CourseTag> {

  @ForeignKey(() => Tag)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  tagId!: number;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  courseId!: number;

  @BelongsTo(() => Tag)
  tag!: Tag;
  @BelongsTo(() => Course)
  course!: Course;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
