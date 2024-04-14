import { Comment } from "../../models/Comment";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface ICommentRepository extends BaseRepositoryInterface<Comment> {
    
}