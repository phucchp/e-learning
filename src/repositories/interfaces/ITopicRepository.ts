import { Topic } from "../../models/Topic";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface ITopicRepository extends BaseRepositoryInterface<Topic> {
    createTopics(topics: any[]): Promise<Topic[]> ;
}