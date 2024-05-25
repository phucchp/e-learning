import { Service } from "typedi";
import { Result } from "../models/Result";
import { IResultRepository } from "./interfaces/IResultRepository";
import { BaseRepository } from "./BaseRepository";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { Sequelize } from 'sequelize-typescript';
@Service()
export class ResultRepository extends BaseRepository<Result> implements IResultRepository{

    constructor(){
		super(Result);
	}
}