import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, ForeignKey, BelongsTo, AllowNull, NotEmpty, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Category } from './Category';
import { User } from './User';
import { Language } from './Language';
import { Level } from './Level';
import { Topic } from './Topic';
import { Favorite } from './Favorite';
import { Enrollment } from './Enrollment';
import { Lesson } from './Lesson';

@Table({
  tableName: 'comments',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Comment extends Model<Comment> {
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    id!: number;

    @ForeignKey(() => Lesson)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    lessonId!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    userId!: number;

    @ForeignKey(() => Comment)
    @Column({
        type: DataType.INTEGER,
    })
    parentId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
    })
    content!: string;

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