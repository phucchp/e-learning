import { Remind } from "../../models/Remind";
import { Request} from 'express';

export interface IRemindService {
    getReminds(): Promise<Remind[]>;
    addRemind(userId: number, lessonId: number, time: string): Promise<Remind>;
    deleteRemind(userId: number, lessonId: number): Promise<void>;
    updateRemind(userId: number, lessonId: number, time: string): Promise<Remind>;
}