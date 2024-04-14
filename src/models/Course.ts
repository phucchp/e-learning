// models/Course.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, ForeignKey, BelongsTo, AllowNull, NotEmpty, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Category } from './Category';
import { User } from './User';
import { Language } from './Language';
import { Level } from './Level';
import { Topic } from './Topic';
import { Favorite } from './Favorite';
import { Enrollment } from './Enrollment';
import { Cart } from './Cart';
import { Review } from './Review';
import { PaymentDetail } from './PaymentDetail';

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

  @Column({
    type: DataType.TEXT,
  })
  learnsDescription!: string | null;

  @Column({
    type: DataType.TEXT,
  })
  requirementsDescription!: string | null;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  price!: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  discount!: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  duration!: number;

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
  })
  averageRating!: number;

  @Column({
    type: DataType.STRING,
  })
  trailerUrl!: string | null;

  @Column({
    type: DataType.STRING,
  })
  subUrl!: string | null;

  @Column({
    type: DataType.STRING,
    get() {
        const rawValue = this.getDataValue('posterUrl');
        if(rawValue) {
          return 
        }
        return rawValue ? rawValue.toUpperCase() : null;
    }
  })
  posterUrl!: string | null;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  totalStudents!: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
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
  })
  isActive!: boolean;

  @HasMany(() => Topic)
  topics!: Topic[];

  @BelongsToMany(() => User, {
    through:() => Favorite, 
    as:'favorites'
  })
  favorites!: User[];

  // @BelongsToMany(() => User, () => Enrollment, 'enrolledUsers')
  // enrolledUsers!: User[];

  @BelongsToMany(() => User, () => Cart, 'cartUsers')
  carts!: User[];
  
  // @BelongsToMany(() => User, {
  //   through: () => Review, 
  //   as: 'reviews'
  // })
  // reviews!: User[];
  @HasMany(() => Review)
  reviews!: Review[];

  @HasMany(() => Enrollment)
  enrollments!: Enrollment[];

  @HasMany(() => PaymentDetail)
  paymentDetails!: PaymentDetail[];
  
  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
