import { NoteService } from "../services/NoteService";
import { INoteService } from "../services/interfaces/INoteService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { handleErrorController } from "../utils/CustomError";

export class NoteController{
	private noteService: INoteService;

	constructor() {
		this.noteService = Container.get(NoteService);
	}

    getNotes = async (req: Request, res: Response) => {
        try{
            const notes = await this.noteService.getNotes(req);
            return res.status(200).json({
                message: "Successful",
                page: req.query.page || 1,
                pageSize: req.query.pageSize || 10,
                totalCount: notes.count,
                totalPage: Math.ceil(notes.count/Number(req.query.pageSize || 10)),
                data: notes.rows
            });
        }catch(error){
            handleErrorController(error, res);
        }
    }

    createNote = async (req: Request, res: Response) => {
        try{
            const newNote = await this.noteService.createNote(req);
            return res.status(200).json({
                message: "Successful",
                data: newNote
            });
        }catch(error){
            handleErrorController(error, res);
        }
    }

    updateNote = async (req: Request, res: Response) => {
        try{
            const newNote = await this.noteService.updateNote(req);
            return res.status(200).json({
                message: "Successful",
                data: newNote
            });
        }catch(error){
            handleErrorController(error, res);
        }
    }

    deleteNote = async (req: Request, res: Response) => {
        try{
            const userId = req.payload.userId;
            const noteId = Number(req.params.noteId);
            const newNote = await this.noteService.deleteNote(noteId, userId);
            return res.status(200).json({
                message: "Successful",
            });
        }catch(error){
            handleErrorController(error, res);
        }
    }
}