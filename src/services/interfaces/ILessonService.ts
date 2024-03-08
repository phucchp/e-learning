import { Lesson } from "../../models/Lesson";
import { Request} from 'express';

export interface ILessonService {
    getLesson(lessonId: number, userId: number): Promise<Lesson>;
    createLesson(req: Request): Promise<Lesson>;
    createMultipleLesson(req: Request): Promise<Lesson>;
    updateLesson(req: Request): Promise<Lesson>;
    deleteLesson(lessonId: string): Promise<void>;
}