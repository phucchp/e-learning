import { Inject, Service } from 'typedi';
import { ISubtitleService } from './interfaces/ISubtitleService';
import { Subtitle } from '../models/Subtitle';
import { Request } from 'express';
import { SubtitleRepository } from '../repositories/SubtitleRepository';
import { ISubtitleRepository } from '../repositories/interfaces/ISubtitleRepository';
import { NotFound, ServerError } from '../utils/CustomError';
import { LanguageRepository } from '../repositories/LanguageRepository';
import { ILanguageRepository } from '../repositories/interfaces/ILanguageRepository';
import { S3Service } from './S3Service';
import { Op } from 'sequelize';
import { Language } from '../models/Language';

@Service()
export class SubtitleService implements ISubtitleService {

    @Inject(() => SubtitleRepository)
	private subtitleRepository!: ISubtitleRepository;

    @Inject(() => LanguageRepository)
	private languageRepository!: ILanguageRepository;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    /**
     * Get subtitle from S3 using preSignUrl
     * @param lessonId
     * @param languageCode 
     */
    async getSubtitle(lessonId: number, languageCode: string): Promise<string> {
        const language = await this.languageRepository.findOneByCondition({
            code: languageCode
        });
        if (!language) {
            throw new NotFound('Language not found');
        }

        const subtitle = await this.subtitleRepository.findOneByCondition({
            lessonId: lessonId,
            languageId: language.id
        });

        if (!subtitle) {
            throw new NotFound(`subtitle with language code: ${languageCode} not found`);
        }
        const url = subtitle.url;
        return await this.s3Service.getObjectUrl(url);
    }

    /**
     * Get all language code of subtitle of lesson
     */
    async getAllSubtitleLangCodeOfLesson(lessonId: number): Promise<Language[]> {
        const languageIds: number[] = [];
        const subtitles = await this.subtitleRepository.getAll({
            lessonId: lessonId,
        });

        for(const subtitle of subtitles) {
            languageIds.push(subtitle.languageId);
        }

        if (languageIds.length === 0) {
            return [];
        }
        const languages = await this.languageRepository.getAll({
            where:{
                id: {
					[Op.in]:languageIds
				}
            }
        });

        return languages;
    }

    /**
     * Get pre-signedUrl to update subtitle to S3
     * @param subtitleId 
     * @param name 
     */
    async getPresignUrlUpdateSubtitle(subtitleId: number): Promise<string> {
        // en.srt, vi.srt
        const subtitle = await this.subtitleRepository.findById(subtitleId);
        if (!subtitle) {
            throw new NotFound('Subtitle not found');
        }

        if (!subtitle.url) {
            const language = await this.languageRepository.findById(subtitle.languageId);
            if (!language) {
                throw new NotFound('language not found');
            }
            subtitle.url = `lessons/${subtitle.lessonId}/${language.code}.srt`
        }
        
        return await this.s3Service.getObjectUrl(subtitle.url);
    }

    /**
     * Add subtitle for lesson
     * @param lessonId 
     * @param languageId 
     */
    async addSubtitle(lessonId: number, languageId: number): Promise<Subtitle> {
        // Check language is already exists
        const language = await this.languageRepository.findById(languageId);
        if (!language) {
            throw new NotFound('Language not found!');
        }

        // Check subtitle is already exists
        const subtitle = await this.subtitleRepository.findOneByCondition({
            lessonId: lessonId,
            languageId: language.id
        });

        if (!subtitle) {
            const url = `lessons/${lessonId}/${language.code}.srt`;
            const newSubtitle =  await this.subtitleRepository.create({
                lessonId: lessonId,
                url: url,
                languageId: language.id
            });
            newSubtitle.setDataValue('url', await this.s3Service.getObjectUrl(url));

            return newSubtitle;
        }
        
        subtitle.setDataValue('url', await this.s3Service.getObjectUrl(subtitle.url))

        return subtitle;
    }

    /**
     * Delete subtitle
     * @param subtitleId 
     * @param name 
     */
    async deleteSubtitle(subtitleId: number): Promise<void> {
        // Delete from database
        // Delete in S3 (Có thể bỏ qua)
        // Clear cache cloudfront
        const subtitle = await this.subtitleRepository.findById(subtitleId);
        if (!subtitle) {
            throw new NotFound('Subtitle not found');
        }
        await this.s3Service.deleteObject(subtitle.url);
        await this.s3Service.clearCacheCloudFront(subtitle.url);
        await this.subtitleRepository.deleteInstance(subtitle, true);
    }

    async getSubtitleById(subtitleId: number): Promise<Subtitle> {
        const subtitle = await this.subtitleRepository.findById(subtitleId);
        if (!subtitle) {
            throw new NotFound('Subtitle not found');
        }

        return subtitle;
    }
}
