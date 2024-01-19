import { Service } from "typedi";
import { Lesson } from "../models/Lesson";
import { ILessonRepository } from "./interfaces/ILessonRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class LessonRepository extends BaseRepository<Lesson> implements ILessonRepository{

    constructor(){
		super(Lesson);
	}
}