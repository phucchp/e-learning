import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Course } from './Course';

@Table({
  tableName: 'reviews',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Review extends Model<Review> {
  
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

  @Column({
    type: DataType.DECIMAL(2,1),
  })
  rating!: number;

  @Column({
    type: DataType.STRING,
  })
  review!: string;

  @BelongsTo(() => User)
  user!: User;
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
