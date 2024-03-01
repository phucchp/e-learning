// models/Language.ts

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, DeletedAt, AllowNull, HasMany } from 'sequelize-typescript';
import { Course } from './Course';
import { Subtitle } from './Subtitle';

@Table({
  tableName: 'languages',
  timestamps: true,
  paranoid: true,
  underscored: true, // Use naming convention snake_case
})
export class Language extends Model<Language> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  languageName!: string;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(10),
  })
  code!: string;

  @HasMany(() => Course)
  courses!: Course[];

  @HasMany(() => Subtitle)
  subtitles!: Subtitle[];

  @DeletedAt
  deletedAt?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updatedAt!: Date;
}
