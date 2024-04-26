import { Comment } from "../../models/Comment";

export interface ICommentService {
    createComment(userId: number, lessonId: number,parentId: number, content: string): Promise<Comment>;
    updateComment(commentId: number, userId: number, content: string): Promise<Comment>;
    deleteComment(commentId: number, userId: number): Promise<void>;
}