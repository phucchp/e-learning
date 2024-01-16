import { Language } from "../../models/Language";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface ILanguageRepository extends BaseRepositoryInterface<Language> {

}