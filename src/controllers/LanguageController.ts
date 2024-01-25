import { LanguageService } from "../services/LanguageService";
import { ILanguageService } from "../services/interfaces/ILanguageService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { handleErrorController } from "../utils/CustomError";

export class LanguageController{
	private languageService: ILanguageService;

	constructor() {
		this.languageService = Container.get(LanguageService);
	}

	getLanguages = async (req: Request, res: Response) => {
        const languages = await this.languageService.getLanguages();
        return res.status(200).json({
            message: "Successfull",
            data: languages
        });
    }

    getLanguage = async (req: Request, res: Response) => {
        const languageId = Number(req.params.languageId);
        const language = await this.languageService.getLanguage(languageId);
        return res.status(200).json({
            message: "success",
            data: language
        });
    }

    createLanguage = async (req: Request, res: Response) => {
        const newLanguage = await this.languageService.createLanguage(req);
        return res.status(200).json({
            message: "success",
            data: newLanguage
        });
    }

    updateLanguage = async (req: Request, res: Response) => {
        const newLanguage = await this.languageService.updateLanguage(req);
        return res.status(200).json({
            message: "success",
            data: newLanguage
        });
    }

    deleteLanguage = async (req: Request, res: Response) => {
        const languageId = Number(req.params.languageId);
        const language = await this.languageService.deleteLanguage(languageId);
        return res.status(200).json({
            message: "success",
            data: language
        });
    }
}