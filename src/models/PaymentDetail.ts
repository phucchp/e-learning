// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Payment } from './Payment';
import { Course } from './Course';

@Table({
  tableName: 'payment_details',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class PaymentDetail extends Model<PaymentDetail> {
  @ForeignKey(() => Payment)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  paymentId!: number;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    unique: 'compositeIndex'
  })
  courseId!: number;
  
  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
  })
  discount!: number;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isPaidToInstructor!: boolean;

  @BelongsTo(() => Payment)
  payment!: Payment;

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
