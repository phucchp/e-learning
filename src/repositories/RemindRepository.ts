import { Service } from "typedi";
import { Remind } from "../models/Remind";
import { IRemindRepository } from "./interfaces/IRemindRepository";
import { BaseRepository } from "./BaseRepository";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { Sequelize } from 'sequelize-typescript';
@Service()
export class RemindRepository extends BaseRepository<Remind> implements IRemindRepository{

    constructor(){
		super(Remind);
	}

    async getReminds(options: any): Promise<Remind[]> {
        throw new Error("Method not implemented.");
    }
}