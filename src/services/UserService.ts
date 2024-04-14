import { Inject, Service } from 'typedi';
import { IUserService } from './interfaces/IUserService';
import { User } from '../models/User';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';

@Service()
export class UserService implements IUserService {
    
    @Inject(() => UserRepository)
	private userRepository!: IUserRepository;
    
    getUsers(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
    getUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<User> {
        throw new Error('Method not implemented.');
    }

    async isAdmin(userId: number): Promise<boolean>{
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new NotFound('User not found or is not actived');
        }
        if(user.roleId===3){
            return true;
        }
        return false;
    }

    async isInstructor(userId: number): Promise<boolean>{
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new NotFound('User not found or is not actived');
        }
        if(user.roleId===2 || user.roleId===3){
            return true;
        }
        return false;
    }

    async getCarts(userId: number, search: string): Promise<{ rows: User[]; count: number; }> {
        return await this.userRepository.getCarts(userId, search);
    }

    async getUserInformation(userId: number): Promise<User> {
        return await this.userRepository.getUserInformation(userId);
    }
}
