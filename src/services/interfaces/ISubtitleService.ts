import { Subtitle } from "../../models/Subtitle";
import { Request} from 'express';

export interface ISubtitleService {
    getSubtitle(lessonId: number, languageCode: string): Promise<string>;
    getPresignUrlUpdateSubtitle(lessonId: number, languageCode: string): Promise<string>;
    deleteSubtitle(lessonId: number, languageCode: string): Promise<void>;
}