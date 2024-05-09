import { Resource } from "../../models/Resource";
import { Request} from 'express';

export interface IResourceService {
    getResource(resourceId: number): Promise<Resource>;
    getAllResourceOfLesson(lessonId: number): Promise<Resource[]>;
    createResource(lessonId: number, name: string ): Promise<Resource>;
    updateResource(resourceId: number): Promise<Resource>;
    deleteResource(resourceId: number): Promise<void>;
}