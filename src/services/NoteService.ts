import { Inject, Service } from 'typedi';
import { INoteService } from './interfaces/INoteService';
import { Note } from '../models/Note';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotEnoughAuthority, NotFound, RecordExistsError, ServerError, handleErrorFunction } from '../utils/CustomError';
import * as crypto from 'crypto';
import { NoteRepository } from '../repositories/NoteRepository';
import { INoteRepository } from '../repositories/interfaces/INoteRepository';
import { Op } from 'sequelize';

@Service()
export class NoteService implements INoteService {

    @Inject(() => NoteRepository)
	private noteRepository!: INoteRepository;

    async getNotes(req: Request): Promise<{ rows: Note[]; count: number}> {
        const userId= req.payload.userId; // Requied
        const {lessonId, sort, page, pageSize, search, time} = req.query;
        let sortField = 'updatedAt';
        const whereCondition: any = {};
        whereCondition['userId'] = userId;
        whereCondition['lessonId'] = lessonId;
        if(search){
            whereCondition.content = { [Op.iLike]: `%${search}%` };
        }
        if(time){
            whereCondition.time = { [Op.eq]: time };
        }

        const options = {
            whereCondition,
            sort: sortField, 
            sortType: 'ASC',
            page: page || 1,
            pageSize: pageSize || 10
        };
        if(sort==='oldest'){
            options.sort = 'createdAt';
            options.sortType = 'ASC';
        }else if(sort==='newest'){
            options.sort = 'createdAt';
            options.sortType = 'DESC';
        }
        const notes = await this.noteRepository.getNotes(options);
        return notes;
    }
    async getNote(noteId: number): Promise<Note> {
        throw new Error('Method not implemented.');
    }
    async createNote(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Note> {
        const userId = req.payload.userId;
        const {lessonId, content, time} = req.body;
        const noteUser = await this.noteRepository.findOneByCondition({
            userId: userId,
            time: time
        });
        if(noteUser){
            throw new DuplicateError('Can not add multiple notes in a same time');
        }
        return await this.noteRepository.create({
            userId: userId,
            lessonId: lessonId,
            time: time,
            content: content
        });
    }
    async updateNote(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Note> {
        const userId = req.payload.userId;
        const {content, time} = req.body;
        const noteId = Number(req.params.noteId);
        const noteInstance = await this.noteRepository.findById(noteId);
        if(!noteInstance) {
            throw new NotFound("Note not found!");
        }
        if(noteInstance.userId !== Number(userId)){
            throw new NotEnoughAuthority('Forbidden, notes are not owned by the user');
        }
        noteInstance.content= content;
        if(time){
            noteInstance.time = time;
        }
        const newNote = await this.noteRepository.updateInstace(noteInstance);
        if(!newNote) {
            throw new Error('Error while updating!');
        }
        return newNote;
    }
    async deleteNote(noteId: number, userId: number): Promise<void> {
        const note = await this.noteRepository.findById(noteId);
        if(!note) {
            throw new NotFound("Note not found!");
        }
        if(note.userId !== Number(userId)){
            throw new NotEnoughAuthority('Forbidden, notes are not owned by the user');
        }
        await this.noteRepository.delete(noteId, true);
    }
}