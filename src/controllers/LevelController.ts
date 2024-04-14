import { LevelService } from "../services/LevelService";
import { ILevelService } from "../services/interfaces/ILevelService";
import Container from 'typedi';
import { Request, Response } from 'express';

export class LevelController{
	private levelService: ILevelService;

	constructor() {
		this.levelService = Container.get(LevelService);
	}
}