import { Cart } from "../../models/Cart";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface ICartRepository extends BaseRepositoryInterface<Cart> {

}