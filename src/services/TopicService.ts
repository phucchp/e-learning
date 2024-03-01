import { Inject, Service } from 'typedi';
import { ITopicService } from './interfaces/ITopicService';
import { Topic } from '../models/Topic';
import { Request } from 'express';
import { TopicRepository } from '../repositories/TopicRepository';
import { ITopicRepository } from '../repositories/interfaces/ITopicRepository';

@Service()
export class TopicService implements ITopicService {

    @Inject(() => TopicRepository)
	private topicRepository!: ITopicRepository;

    createTopic(courseId: number, name: string): Promise<Topic> {
        throw new Error('Method not implemented.');
    }
    updateTopic(topicId: number): Promise<Topic> {
        throw new Error('Method not implemented.');
    }
    deleteTopic(topicId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
}