import { Resource } from "../../models/Resource";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IResourceRepository extends BaseRepositoryInterface<Resource> {
   
}