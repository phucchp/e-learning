import { Service } from "typedi";
import { Note } from "../models/Note";
import { INoteRepository } from "./interfaces/INoteRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class NoteRepository extends BaseRepository<Note> implements INoteRepository{

    constructor(){
		super(Note);
	}
}