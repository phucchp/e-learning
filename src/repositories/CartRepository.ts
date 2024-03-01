import { Service } from "typedi";
import { Cart } from "../models/Cart";
import { ICartRepository } from "./interfaces/ICartRepository";
import { BaseRepository } from "./BaseRepository";
import { Op } from 'sequelize';

@Service()
export class CartRepository extends BaseRepository<Cart> implements ICartRepository{

    constructor(){
		super(Cart);
	}

	async deleteCoursesFromCart(userId: number, courseIds: number[]): Promise<number>{
		return await this.model.destroy({
			where: {
				userId: userId,
				courseId: {
					[Op.in]:courseIds
				}
			}
		});
	}
}