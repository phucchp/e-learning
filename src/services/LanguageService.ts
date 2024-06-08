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
import { RedisService } from './RedisService';

@Service()
export class LanguageService implements ILanguageService {

    @Inject(() => LanguageRepository)
	private languageRepository!: ILanguageRepository;


    @Inject(() => RedisService)
	private redisService!: RedisService;

    async getLanguages(): Promise<Language[]> {
        const cacheKey = 'getLanguages';
        const cachedResult = await this.redisService.getCache(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        const languages = await this.languageRepository.getAll();
        await this.redisService.setCache(cacheKey, languages, 10*60);
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
        await this.redisService.clearAllCache();
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
                await this.redisService.clearAllCache();
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
            await this.redisService.clearAllCache();
            return;
        }
        throw new NotFound('Language not found!');
    }
}
