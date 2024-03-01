// models/Profile.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, ForeignKey, BelongsTo, AllowNull, IsInt } from 'sequelize-typescript';
import { User } from './User'; // Assuming your User model is in the same directory

@Table({
  tableName: 'profiles',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Profile extends Model<Profile> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @IsInt
  @Unique(true)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING(30),
  })
  firstName!: string | null;

  @Column({
    type: DataType.STRING(30),
  })
  lastName!: string | null;

  @Column({
    type: DataType.VIRTUAL,
    get() {
        const firstName = this.getDataValue('firstName');
        const lastName = this.getDataValue('lastName');
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        return fullName.trim();
    },
  })
  fullName!: string | null;

  @Default('default/avatar.jpg')
  @Column({
    type: DataType.TEXT,
  })
  avatar!: string | null;

  @Column({
    type: DataType.TEXT,
  })
  description!: string | null;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
