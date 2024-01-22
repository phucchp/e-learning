import { Service } from "typedi";
import { Cart } from "../models/Cart";
import { ICartRepository } from "./interfaces/ICartRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class CartRepository extends BaseRepository<Cart> implements ICartRepository{

    constructor(){
		super(Cart);
	}
}