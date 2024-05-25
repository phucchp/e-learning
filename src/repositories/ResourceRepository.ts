import { Service } from "typedi";
import { Resource } from "../models/Resource";
import { IResourceRepository } from "./interfaces/IResourceRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class ResourceRepository extends BaseRepository<Resource> implements IResourceRepository{

    constructor(){
		super(Resource);
	}
}