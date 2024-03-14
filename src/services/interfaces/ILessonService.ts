import { Lesson } from "../../models/Lesson";
import { Request} from 'express';

export interface ILessonService {
    getLesson(lessonId: number, userId: number): Promise<Lesson>;
    createLessons(req: Request): Promise<Lesson[]>;
    updateLesson(req: Request): Promise<Lesson>;
    deleteLesson(lessonId: number): Promise<void>;
    getLinkUpdateVideoLesson(lessonId: number): Promise<string>;
}