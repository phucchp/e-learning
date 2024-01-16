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
}