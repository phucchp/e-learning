import { Inject, Service } from 'typedi';
import { ILanguageService } from './interfaces/ILanguageService';
import { Language } from '../models/Language';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError, handleErrorFunction } from '../utils/CustomError';
import * as crypto from 'crypto';
import { LanguageRepository } from '../repositories/LanguageRepository';
import { ILanguageRepository } from '../repositories/interfaces/ILanguageRepository';

@Service()
export class LanguageService implements ILanguageService {

    @Inject(() => LanguageRepository)
	private languageRepository!: ILanguageRepository;

    async getLanguages(): Promise<Language[]> {
       try{
            const languages = await this.languageRepository.getAll();
            return languages;
       }catch(error){
            console.log(error);
            handleErrorFunction(error);
       }
    }

    async getLanguage(languageId: number): Promise<Language> {
        try{
            const language = await this.languageRepository.findById(languageId);
            if(!language){
                throw new NotFound('Language not found');
            }
            return language;
       }catch(error){
            console.log(error);
            handleErrorFunction(error);
       }
    }
    createLanguage(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Language> {
        throw new Error('Method not implemented.');
    }
    updateLanguage(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Language> {
        throw new Error('Method not implemented.');
    }
    deleteLanguage(languageId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
}