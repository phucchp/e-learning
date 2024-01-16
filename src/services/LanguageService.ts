import { Inject, Service } from 'typedi';
import { ILanguageService } from './interfaces/ILanguageService';
import { Language } from '../models/Language';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError, handleErrorFunction } from '../utils/CustomError';
import * as crypto from 'crypto';
import { LanguageRepository } from '../repositories/LanguageRepository';
import { ILanguageRepository } from '../repositories/interfaces/ILanguageRepository';

@Service()
export class LanguageService implements ILanguageService {

    @Inject(() => LanguageRepository)
	private languageRepository!: ILanguageRepository;

    getLanguages(): Promise<Language[]> {
        throw new Error('Method not implemented.');
    }

    getLanguage(languageId: string): Promise<Language> {
        throw new Error('Method not implemented.');
    }
    createLanguage(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Language> {
        throw new Error('Method not implemented.');
    }
    updateLanguage(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Language> {
        throw new Error('Method not implemented.');
    }
    deleteLanguage(languageId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}