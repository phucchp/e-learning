import { Service } from "typedi";
import { User } from "../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class UserRepository extends BaseRepository<User> implements IUserRepository{

    constructor(){
		super(User);
	}
}