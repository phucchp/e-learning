import { Service } from "typedi";
import { Review } from "../models/Review";
import { IReviewRepository } from "./interfaces/IReviewRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class ReviewRepository extends BaseRepository<Review> implements IReviewRepository{

    constructor(){
		super(Review);
	}
}