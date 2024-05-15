import { Service } from "typedi";
import { Question } from "../models/Question";
import { IQuestionRepository } from "./interfaces/IQuestionRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class QuestionRepository extends BaseRepository<Question> implements IQuestionRepository{

    constructor(){
		super(Question);
	}

    async createInBulks(data:any[]): Promise<Question[]> {
        return await this.model.bulkCreate(data);
    } 
}
