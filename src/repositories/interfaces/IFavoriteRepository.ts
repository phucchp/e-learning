import { Favorite } from "../../models/Favorite";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IFavoriteRepository extends BaseRepositoryInterface<Favorite> {
    getCoursesFavorite(userId: number, options: any): Promise<{ rows: Favorite[]; count: number}>;
}