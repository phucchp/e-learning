import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, IsEmail, IsInt, NotEmpty, AllowNull } from 'sequelize-typescript';

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

    @DeletedAt
    deletedAt?: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}
