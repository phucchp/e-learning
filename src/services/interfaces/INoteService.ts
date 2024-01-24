import { Note } from "../../models/Note";
import { Request} from 'express';

export interface INoteService {
    getNotes(req: Request): Promise<{ rows: Note[]; count: number}>;
    getNote(noteId: number): Promise<Note>;
    createNote(req: Request): Promise<Note>;
    updateNote(req: Request): Promise<Note>;
    deleteNote(noteId: number, userId: number): Promise<void>;
}