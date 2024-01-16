import { Service } from "typedi";
import { Language } from "../models/Language";
import { ILanguageRepository } from "./interfaces/ILanguageRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class LanguageRepository extends BaseRepository<Language> implements ILanguageRepository{

    constructor(){
		super(Language);
	}
}