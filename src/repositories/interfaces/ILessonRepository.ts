import { Lesson } from "../../models/Lesson";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface ILessonRepository extends BaseRepositoryInterface<Lesson> {
    getLessonDetails(lessonId: number): Promise<Lesson|null>;
    createLessons(lessons: any[]): Promise<Lesson[]>;
}