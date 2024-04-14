import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, ForeignKey, BelongsTo, AllowNull, IsInt } from 'sequelize-typescript';
import { Question } from './Question';

@Table({
    tableName: 'answers',
    timestamps: true,
    paranoid: true,
    underscored: true, // Use naming convention snake_case
})
export class Answer extends Model<Answer> {
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    id!: number;

    @ForeignKey(() => Question)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    questionId!: number;

    @AllowNull(false)
    @Column({
      type: DataType.TEXT,
    })
    content!: string

    @AllowNull(false)
    @Default(false)
    @Column({
      type: DataType.BOOLEAN,
    })
    isCorrect!: boolean;

    @DeletedAt
    deletedAt?: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;

    @BelongsTo(() => Question)
    question!: Question;
}