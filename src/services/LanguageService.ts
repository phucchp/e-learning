import { Inject, Service } from 'typedi';
import { ILanguageService } from './interfaces/ILanguageService';
import { Language } from '../models/Language';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { LanguageRepository } from '../repositories/LanguageRepository';
import { ILanguageRepository } from '../repositories/interfaces/ILanguageRepository';

@Service()
export class LanguageService implements ILanguageService {

    @Inject(() => LanguageRepository)
	private languageRepository!: ILanguageRepository;

    async getLanguages(): Promise<Language[]> {
        const languages = await this.languageRepository.getAll();
        return languages;
    }

    async getLanguage(languageId: number): Promise<Language> {
        const language = await this.languageRepository.findById(languageId);
        if(language){
            return language;
        }
        throw new NotFound('Language not found or deleted!');
    }

    async createLanguage(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Language> {
        const {name} =req.body;
        const language = await this.languageRepository.findOneByCondition({
            languageName : name
        },[], true);
        if(language){
            throw new RecordExistsError('Language already exists');
        }
        const newLanguage = await this.languageRepository.create({
            languageName: name
        });
        return newLanguage; 
    }

    async updateLanguage(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Language> {
        const {languageName} =req.body;
        const languageId = req.params.languageId;
        const language = await this.languageRepository.findOneByCondition({
            id: languageId
        });
        if(language) {
            const checkName  = await this.languageRepository.findOneByCondition({
                languageName : languageName
            },[], true);
            if(checkName){
                throw new RecordExistsError('Language name already exists');
            }
            const newLanguage = await this.languageRepository.update(language.getDataValue('id'),{
                languageName: languageName
            });
            if(newLanguage){
                return newLanguage;
            }
            throw new NotFound('Faild');
        }
        throw new NotFound('Language not found!');
    }

    async deleteLanguage(languageId: number): Promise<void> {
        const language = await this.languageRepository.findOneByCondition({
            id: languageId
        });
        if(language){
            await this.languageRepository.delete(language.getDataValue('id'));
            return;
        }
        throw new NotFound('Language not found!');
    }
}