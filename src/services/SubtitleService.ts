import { Inject, Service } from 'typedi';
import { ISubtitleService } from './interfaces/ISubtitleService';
import { Subtitle } from '../models/Subtitle';
import { Request } from 'express';
import { SubtitleRepository } from '../repositories/SubtitleRepository';
import { ISubtitleRepository } from '../repositories/interfaces/ISubtitleRepository';
import { NotFound, ServerError } from '../utils/CustomError';

@Service()
export class SubtitleService implements ISubtitleService {

    @Inject(() => SubtitleRepository)
	private subtitleRepository!: ISubtitleRepository;

    /**
     * Get subtitle from S3 using preSignUrl
     * @param lessonId
     * @param languageCode 
     */
    getSubtitle(lessonId: number, languageCode: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * Get presignUrl to update subtitle to S3
     * @param subtitleId 
     * @param name 
     */
    getPresignUrlUpdateSubtitle(subtitleId: number, name: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * Delete subtitle
     * @param subtitleId 
     * @param name 
     */
    deleteSubtitle(subtitleId: number): Promise<void> {
        // Delete from database
        // Delete in S3 (Có thể bỏ qua)
        // Clear cache cloudfront
        throw new Error('Method not implemented.');
    }

}
