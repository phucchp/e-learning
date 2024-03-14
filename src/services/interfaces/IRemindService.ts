import { Remind } from "../../models/Remind";
import { Request} from 'express';

export interface IRemindService {
    getReminds(): Promise<Remind[]>;
}