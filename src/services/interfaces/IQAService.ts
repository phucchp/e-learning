import { Question } from "../../models/Question";
import { Request} from 'express';

export interface IQAService {
    createQA(req: Request): Promise<Question[]>;
    deleteQuestion(questionId: number) : Promise<void>;
    // updateQuestion(questionId: number)
    getAllQuestionOfTopic(topicId: number): Promise<{rows: Question[], count: number}>;

}