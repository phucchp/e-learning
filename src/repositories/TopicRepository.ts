import { Service } from "typedi";
import { Topic } from "../models/Topic";
import { ITopicRepository } from "./interfaces/ITopicRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class TopicRepository extends BaseRepository<Topic> implements ITopicRepository{

    constructor(){
		super(Topic);
	}

	async createTopics(topics: any[]): Promise<Topic[]> {
		return await this.model.bulkCreate(topics);
	}
}