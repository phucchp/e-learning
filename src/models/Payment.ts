// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { PaymentDetail } from './PaymentDetail';

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Payment extends Model<Payment> {
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

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  price!: number;
  
  @AllowNull(false)
  @Default('Paypal')
  @Column({
    type: DataType.STRING,
  })
  paymentMethod!: string;
  
  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  transactionId!:number;
  
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  status!:string;
  
  @Column({
    type: DataType.STRING,
  })
  orderInfor!:string;
  
  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isPayment!: boolean;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => PaymentDetail)
  paymentDetails!:PaymentDetail[];

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
