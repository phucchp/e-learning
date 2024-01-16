import { Language } from "../../models/Language";
import { Request} from 'express';

export interface ILanguageService {
    getLanguages(): Promise<Language[]>;
    getLanguage(languageId: string): Promise<Language>;
    createLanguage(req: Request): Promise<Language>;
    updateLanguage(req: Request): Promise<Language>;
    deleteLanguage(languageId: string): Promise<void>;
}