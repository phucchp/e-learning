import { Inject, Service } from 'typedi';
import { IRemindService } from './interfaces/IRemindService';
import { Remind } from '../models/Remind';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { RemindRepository } from '../repositories/RemindRepository';
import { IRemindRepository } from '../repositories/interfaces/IRemindRepository';

@Service()
export class RemindService implements IRemindService {
   

    @Inject(() => RemindRepository)
	private remindRepository!: IRemindRepository;

    async getReminds(): Promise<Remind[]> {
        throw new Error('Method not implemented.');
    }
}