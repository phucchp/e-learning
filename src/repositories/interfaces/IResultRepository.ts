import { Result } from "../../models/Result";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IResultRepository extends BaseRepositoryInterface<Result> {
}