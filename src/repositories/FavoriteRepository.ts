import { Service } from "typedi";
import { Favorite } from "../models/Favorite";
import { IFavoriteRepository } from "./interfaces/IFavoriteRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class FavoriteRepository extends BaseRepository<Favorite> implements IFavoriteRepository{

    constructor(){
		super(Favorite);
	}
}