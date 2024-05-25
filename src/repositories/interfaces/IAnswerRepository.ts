import { Answer } from "../../models/Answer";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IAnswerRepository extends BaseRepositoryInterface<Answer> {
    createInBulks(data:any[]): Promise<Answer[]>;
    deleteAnswerByQuestionId(questionId: number): Promise<number>;
}