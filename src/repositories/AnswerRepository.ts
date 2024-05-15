import { Service } from "typedi";
import { Answer } from "../models/Answer";
import { IAnswerRepository } from "./interfaces/IAnswerRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class AnswerRepository extends BaseRepository<Answer> implements IAnswerRepository{

    constructor(){
		super(Answer);
	}

    async createInBulks(data:any[]): Promise<Answer[]> {
        return await this.model.bulkCreate(data);
    } 

    async deleteAnswerByQuestionId(questionId: number): Promise<number> {
        return await this.model.destroy({
            where: {
                questionId: questionId 
            } ,
            force : true
        });
    } 
}
