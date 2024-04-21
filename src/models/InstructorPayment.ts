import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Topic } from './Topic';
import { Course } from './Course';
import { User } from './User';

@Table({
  tableName: 'instructor_payments',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class InstructorPayment extends Model<InstructorPayment> {
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
    instructorId!: number;

    @AllowNull(false)
    @Column({
      type: DataType.FLOAT,
    })
    amount!: number;

    @AllowNull(false)
    @Column({
      type: DataType.INTEGER,
    })
    discountPercentage!: number;

    @AllowNull(false)
    @Default('PENDING')
    @Column({
      type: DataType.STRING(50),
    })
    transactionStatus!: string;

    @AllowNull(false)
    @Column({
      type: DataType.STRING,
    })
    payoutBatchId!: string;

    @AllowNull(false)
    @Column({
      type: DataType.STRING,
    })
    payoutItemId!: string;

    @AllowNull(false)
    @Column({
      type: DataType.INTEGER,
    })
    payForMonth!: number;

    @AllowNull(false)
    @Column({
      type: DataType.INTEGER,
    })
    payForYear!: number;

    @AllowNull(false)
    @Column({
      type: DataType.STRING,
    })
    receiver!: string;

    @AllowNull(false)
    @Default(false)
    @Column({
      type: DataType.BOOLEAN,
    })
    isTransfer!: boolean;

    @DeletedAt
    deletedAt?: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}