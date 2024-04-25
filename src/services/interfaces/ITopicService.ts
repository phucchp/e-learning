import { Topic } from "../../models/Topic";
import { Request} from 'express';

export interface ITopicService {
    createTopics(courseId: number, name: string []): Promise<Topic[]>;
    updateTopic(topicId: number, name: string): Promise<Topic>;
    deleteTopic(topicId: number): Promise<void>;
}