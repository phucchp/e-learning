import { Inject, Service } from 'typedi';
import { ILevelService } from './interfaces/ILevelService';
import { Level } from '../models/Level';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { LevelRepository } from '../repositories/LevelRepository';
import { ILevelRepository } from '../repositories/interfaces/ILevelRepository';

@Service()
export class LevelService implements ILevelService {

    @Inject(() => LevelRepository)
	private levelRepository!: ILevelRepository;

    getLevels(): Promise<Level[]> {
        throw new Error('Method not implemented.');
    }
    getLevel(levelId: string): Promise<Level> {
        throw new Error('Method not implemented.');
    }
    createLevel(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Level> {
        throw new Error('Method not implemented.');
    }
    updateLevel(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Level> {
        throw new Error('Method not implemented.');
    }
    deleteLevel(LlvelId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}