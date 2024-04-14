import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, ForeignKey, BelongsTo, AllowNull, IsInt, HasMany } from 'sequelize-typescript';
import { User } from './User'; // Assuming your User model is in the same directory
import { Topic } from './Topic';
import { Answer } from './Answer';

@Table({
    tableName: 'questions',
    timestamps: true,
    paranoid: true,
    underscored: true, // Use naming convention snake_case
})
export class Question extends Model<Question> {
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

    @ForeignKey(() => Topic)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    topicId!: number;

    @AllowNull(false)
    @Column({
      type: DataType.TEXT,
    })
    content!: string

    @DeletedAt
    deletedAt?: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Topic)
    topic!: Topic;

    @HasMany(() => Answer)
    answers!: Answer[];
}