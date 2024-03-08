import { Lesson } from "../../models/Lesson";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface ILessonRepository extends BaseRepositoryInterface<Lesson> {
    getLessonDetails(lessonId: number, userId: number): Promise<Lesson|null>;
}