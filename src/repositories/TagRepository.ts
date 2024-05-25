import { Service } from "typedi";
import { Tag } from "../models/Tag";
import { ITagRepository } from "./interfaces/ITagRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class TagRepository extends BaseRepository<Tag> implements ITagRepository{

    constructor(){
		super(Tag);
	}


}