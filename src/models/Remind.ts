import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Course } from './Course';
import { Lesson } from './Lesson';

@Table({
  tableName: 'reminds',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Remind extends Model<Remind> {
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
        unique: 'compositeIndex'
    })
    userId!: number;

    @ForeignKey(() => Lesson)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        unique: 'compositeIndex'
    })
    lessonId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
    })
    time!: string;

    @AllowNull(false)
    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    isRemind!: boolean;

    @BelongsTo(() => User)
    user!: User;
    @BelongsTo(() => Lesson)
    lesson!: Lesson;

    @DeletedAt
    deletedAt?: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}
