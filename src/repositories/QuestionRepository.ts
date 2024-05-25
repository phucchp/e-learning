import { Service } from "typedi";
import { Question } from "../models/Question";
import { IQuestionRepository } from "./interfaces/IQuestionRepository";
import { BaseRepository } from "./BaseRepository";
import { Answer } from "../models/Answer";

@Service()
export class QuestionRepository extends BaseRepository<Question> implements IQuestionRepository{

    constructor(){
		super(Question);
	}

    async createInBulks(data:any[]): Promise<Question[]> {
        return await this.model.bulkCreate(data);
    } 

	async getAllQuestionOfTopic(topicId: number): Promise<{rows: Question[], count: number}> {
		return await this.model.findAndCountAll({
            where: {
                topicId: topicId
            },
            attributes: { exclude: ['userId', 'deletedAt'] },
            include: [
                {
                    model: Answer,
                    attributes: { exclude: ['isCorrect', 'deletedAt'] },
                }
            ]
        });
	}
}
