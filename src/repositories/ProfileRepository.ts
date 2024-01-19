import { Service } from "typedi";
import { Profile } from "../models/Profile";
import { IProfileRepository } from "./interfaces/IProfileRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class ProfileRepository extends BaseRepository<Profile> implements IProfileRepository{

    constructor(){
		super(Profile);
	}
}