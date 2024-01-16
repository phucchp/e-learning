import { Service } from "typedi";
import { Level } from "../models/Level";
import { ILevelRepository } from "./interfaces/ILevelRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class LevelRepository extends BaseRepository<Level> implements ILevelRepository{

    constructor(){
		super(Level);
	}
}