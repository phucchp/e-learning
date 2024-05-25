import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lesson } from './Lesson';
import { Language } from './Language';

@Table({
  tableName: 'subtitles',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Subtitle extends Model<Subtitle> {
  
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
      unique: 'compositeIndex'
    })
    lessonId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    url!: string;

    @ForeignKey(() => Language)
    @AllowNull(false)
    @Column({
      type: DataType.INTEGER,
      unique: 'compositeIndex'
    })
    languageId!: number;

    @BelongsTo(() => Lesson)
    lesson!: Lesson;

    @BelongsTo(() => Language)
    language!: Language;

    @DeletedAt
    deletedAt?: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
}
