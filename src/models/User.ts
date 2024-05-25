import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, IsEmail, IsInt, NotEmpty, AllowNull, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Profile } from './Profile';
import { Favorite } from './Favorite';
import { Course } from './Course';
import { Enrollment } from './Enrollment';
import { Comment } from './Comment';
import { Cart } from './Cart';
import { Review } from './Review';
import { Note } from './Note';
import { Payment } from './Payment';
import { Processing } from './Processing';
import { Lesson } from './Lesson';
import { EWallet } from './EWallet';
import { Remind } from './Remind';
import { Question } from './Question';
import { InstructorPayment } from './InstructorPayment';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true, // Sử dụng naming convention snake_case
})
export class User extends Model<User> {
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
      })
    id!: number;

    @NotEmpty
    @AllowNull(false)
    @Unique(true)
    @Column({
    type: DataType.STRING(30),
    })
    userName!: string;

    @IsEmail
    @AllowNull(false)
    @Unique(true)
    @Column({
    type: DataType.STRING(100),
    })
    email!: string;

    @NotEmpty
    @AllowNull(false)
    @Column({
    type: DataType.STRING,
    })
    password!: string;

    @Default(false)
    @NotEmpty
    @AllowNull(false)
    @Column({
    type: DataType.BOOLEAN,
    })
    isActive!: boolean;

    @Default(1)
    @IsInt
    @AllowNull(false)
    @Column({
    type: DataType.INTEGER,
    })
    roleId!: number;

    @HasOne(() => Profile)
    profile!: Profile;

    @BelongsToMany(() => Course, {
      through:() => Favorite,
      as: 'favorites'
    })
    favorites!: Course[];

    // @BelongsToMany(() => Course,{
    //   through: () => Enrollment, 
    //   as:'coursesEnrollments'
    // })
    // coursesEnrollments!: Course[];
    @HasMany(() => Enrollment)
    enrollments!: Enrollment[];


    @BelongsToMany(() => Course, {
      through: () => Cart, 
      as:'carts'
    })
    carts!: Course[];

    // @BelongsToMany(() => Course, {
    //   through:() => Review , 
    //   as:'reviews'
    // })
    // reviews!: Course[];
    @HasMany(() => Review)
    reviews!: Review[];

    @HasMany(() => Remind)
    reminds!: Remind[];

    @HasMany(() => EWallet)
    eWallets!: EWallet[];

    @BelongsToMany(() => Lesson, {
      through:() => Processing,
      as:'processing'
    })
    processing!: Lesson[];

    @HasMany(() => Comment)
    comments!: Comment[];

    @HasMany(() => Note)
    notes!: Note[];

    @HasMany(() => Payment)
    payments!: Payment[];

    @HasMany(() => Question)
    questions!: Question[];

    @HasMany(() => InstructorPayment)
    instructorPayments!: InstructorPayment[];

    @DeletedAt
    deletedAt?: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}
