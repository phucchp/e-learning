import { Topic } from "../../models/Topic";
import { Request} from 'express';

export interface ITopicService {
    createTopic(courseId: number, name: string): Promise<Topic>;
    updateTopic(topicId: number): Promise<Topic>;
    deleteTopic(topicId: number): Promise<void>;
}