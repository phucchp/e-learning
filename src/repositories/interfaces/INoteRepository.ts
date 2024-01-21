import { Note } from "../../models/Note";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface INoteRepository extends BaseRepositoryInterface<Note> {

}