import { Service } from "typedi";
import { Processing } from "../models/Processing";
import { IProcessingRepository } from "./interfaces/IProcessingRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class ProcessingRepository extends BaseRepository<Processing> implements IProcessingRepository{

    constructor(){
		super(Processing);
	}
}