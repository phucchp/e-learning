import { Level } from "../../models/Level";
import { Request} from 'express';

export interface ILevelService {
    getLevels(): Promise<Level[]>;
    getLevel(levelId: string): Promise<Level>;
    createLevel(req: Request): Promise<Level>;
    updateLevel(req: Request): Promise<Level>;
    deleteLevel(LlvelId: string): Promise<void>;
}