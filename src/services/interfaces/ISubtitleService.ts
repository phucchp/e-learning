import { Language } from "../../models/Language";
import { Subtitle } from "../../models/Subtitle";
import { Request} from 'express';

export interface ISubtitleService {
    getSubtitle(lessonId: number, languageCode: string): Promise<string>;
    getPresignUrlUpdateSubtitle(lessonId: number): Promise<string>;
    deleteSubtitle(lessonId: number): Promise<void>;
    getAllSubtitleLangCodeOfLesson(lessonId: number): Promise<Language[]>;
    addSubtitle(lessonId: number, languageId: number): Promise<Subtitle>;
    getSubtitleById(subtitleId: number): Promise<Subtitle>;
}