// models/Level.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, BelongsTo, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { Topic } from './Topic';
import { Note } from './Note';
import { Resource } from './Resource';
import { Processing } from './Processing';
import { User } from './User';
import { Remind } from './Remind';

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
    type: DataType.STRING,
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  duration!: number;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isPreview!: boolean;

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

  @HasMany(() => Note)
  notes!: Note[];

  @BelongsToMany(() => User, () => Processing , 'processing')
  processing!: User[];

  @HasMany(() => Resource)
  resources!: Resource[];

  @HasMany(() => Remind)
  reminds!: Remind[];

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
