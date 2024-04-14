import { Remind } from "../../models/Remind";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IRemindRepository extends BaseRepositoryInterface<Remind> {
    getReminds(options: any): Promise<Remind[]>;
}