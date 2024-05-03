import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'e_wallets',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class EWallet extends Model<EWallet> {
  
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
    @Default('Paypal')
    @Column({
        type: DataType.STRING,
        unique: 'compositeIndex'
    })
    type!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        unique: 'compositeIndex'
    })
    email!: string;

    @BelongsTo(() => User)
    user!: User;

    @DeletedAt
    deletedAt?: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}
