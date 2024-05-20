import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Topic } from './Topic';

@Table({
    tableName: 'results',
    timestamps: true,
    paranoid: true,
    underscored: true, // Use naming convention snake_case
})
export class Result extends Model<Result> {
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

    @ForeignKey(() => Topic)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        unique: 'compositeIndex'
    })
    topicId!: number;

    @Column({
        type: DataType.STRING,
    })
    result!: string;

    @Column({
        type: DataType.INTEGER,
    })
    totalQuestion!: number;

    @Column({
        type: DataType.INTEGER,
    })
    totalCorrectAnswer!: number;

    @Column({
        type: DataType.INTEGER,
    })
    totalInCorrectAnswer!: number;

    @Column({
        type: DataType.INTEGER,
        unique: 'compositeIndex'
    })
    version!: number;

    @Column({
        type: DataType.STRING,
    })
    review!: string;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Topic)
    topic!: Topic;

    @DeletedAt
    deletedAt?: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}
