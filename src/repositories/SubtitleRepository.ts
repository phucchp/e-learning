import { Service } from "typedi";
import { Subtitle } from "../models/Subtitle";
import { ISubtitleRepository } from "./interfaces/ISubtitleRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class SubtitleRepository extends BaseRepository<Subtitle> implements ISubtitleRepository{

    constructor(){
		super(Subtitle);
	}
}