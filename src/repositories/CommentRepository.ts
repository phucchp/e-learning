import { Service } from "typedi";
import { Comment } from "../models/Comment";
import { ICommentRepository } from "./interfaces/ICommentRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class CommentRepository extends BaseRepository<Comment> implements ICommentRepository{

    constructor(){
		super(Comment);
	}
}