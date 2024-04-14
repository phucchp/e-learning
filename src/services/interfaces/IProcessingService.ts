import { Processing } from "../../models/Processing";
import { Request} from 'express';

export interface IProcessingService {
    addProcessing(userId: number, lessonId: number): Promise<Processing>;
    getNewestProcessing(userId: number, courseId: number): Promise<Processing>;
}