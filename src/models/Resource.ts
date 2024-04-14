import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lesson } from './Lesson';

@Table({
  tableName: 'resources',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Resource extends Model<Resource> {
  
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

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    url!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    name!: string;

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
