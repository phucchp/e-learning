// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Topic } from './Topic';

@Table({
  tableName: 'lessons',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Lesson extends Model<Lesson> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  duration!: number;

  @ForeignKey(() => Topic)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  topicId!: number;

  @BelongsTo(() => Topic)
  topic!: Topic;
  
  @AllowNull(true)
  @Column({
    type: DataType.STRING
  })
  lessonUrl!: string;

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
