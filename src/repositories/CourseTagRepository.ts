import { Service } from "typedi";
import { CourseTag } from "../models/CourseTag";
import { ICourseTagRepository } from "./interfaces/ICourseTagRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class CourseTagRepository extends BaseRepository<CourseTag> implements ICourseTagRepository{

    constructor(){
		super(CourseTag);
	}

    async createInBulks(data:any[]): Promise<CourseTag[]> {
        return await this.model.bulkCreate(data);
    } 

}