import { Service } from "typedi";
import { Note } from "../models/Note";
import { INoteRepository } from "./interfaces/INoteRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class NoteRepository extends BaseRepository<Note> implements INoteRepository{

    constructor(){
		super(Note);
	}

	async getNotes(options: any): Promise<{ rows: Note[]; count: number}> {
		try{
			const {whereCondition, page, pageSize, sort, sortType} = options;
			const offset = (page - 1) * pageSize;
			return await this.model.findAndCountAll({
				attributes: { exclude: ['userId', 'deletedAt'] },
				where: whereCondition,
				limit: pageSize,
                offset: offset,
                order: [
                    [sort, sortType],
                ]
			});
		}catch(error){
			throw(error);
		}
	}
}