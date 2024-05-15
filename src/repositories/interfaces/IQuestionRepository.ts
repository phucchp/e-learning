import { Question } from "../../models/Question";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IQuestionRepository extends BaseRepositoryInterface<Question> {
    getAllQuestionOfTopic(topicId: number): Promise<{rows: Question[], count: number}>;
}