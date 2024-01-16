import { Service } from "typedi";
import { Course } from "../models/Course";
import { ICourseRepository } from "./interfaces/ICourseRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository{

    constructor(){
		super(Course);
	}
}