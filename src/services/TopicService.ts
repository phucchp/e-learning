import { Inject, Service } from 'typedi';
import { ITopicService } from './interfaces/ITopicService';
import { Topic } from '../models/Topic';
import { Request } from 'express';
import { TopicRepository } from '../repositories/TopicRepository';
import { ITopicRepository } from '../repositories/interfaces/ITopicRepository';
import { NotFound, ServerError } from '../utils/CustomError';

@Service()
export class TopicService implements ITopicService {

    @Inject(() => TopicRepository)
	private topicRepository!: ITopicRepository;

    
    async createTopics(courseId: number, names: string[]): Promise<Topic[]> {
        const topics = names.map(name => ({
            courseId: courseId,
            name: name
        }));

        return await this.topicRepository.createTopics(topics);
    }
    
    async updateTopic(topicId: number, name: string): Promise<Topic> {
        const topic = await this.topicRepository.findById(topicId);
        if (!topic) {
            throw new NotFound('Topic not found!');
        }
        // Update topic
        topic.name = name;
        const newTopic = await this.topicRepository.updateInstance(topic);
        if (!newTopic) {
            throw new ServerError('Error updating topic!');
        }

        return newTopic;
    }
    
    async deleteTopic(topicId: number): Promise<void> {
        const topic = await this.topicRepository.findById(topicId);
        if (!topic) {
            throw new NotFound('Topic not found!');
        }

        await this.topicRepository.deleteInstance(topic, true);
    }
}
