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
import { HandleS3 } from './utils/HandleS3';
import { S3Service } from './S3Service';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { IProfileRepository } from '../repositories/interfaces/IProfileRepository';

@Service()
export class UserService implements IUserService {
    
    @Inject(() => UserRepository)
	private userRepository!: IUserRepository;

    @Inject(() => ProfileRepository)
	private profileRepository!: IProfileRepository;
    
    getUsers(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
    getUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<User> {
        throw new Error('Method not implemented.');
    }

    @Inject(() => HandleS3)
	private handleS3!: HandleS3;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

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

    async getFavoriteCourses(userId: number, search: string): Promise<{ rows: User[]; count: number; }> {
        let data = await this.userRepository.getFavoriteCourses(userId, search);
        
        if (data.rows.length >= 1 && data.rows !== undefined) {
            console.log(data.rows);
            const courses = data.rows[0].getDataValue('favorites');
            data.rows[0].setDataValue('favorites', await this.handleS3.getResourceCourses(courses));
        }

        return data;
    }

    async getUserInformation(userId: number): Promise<User> {
        return await this.userRepository.getUserInformation(userId);
    }

    async getPresignUrlToUploadAvatar(userId: number): Promise<string> {
        const user = await this.getUserInformation(userId);
        let url = '';
        if (!user.profile) {
            throw new NotFound('Server error, Profile of user does not exist');
        }

        const avatar = user.profile.getDataValue('avatar');
        if (avatar && avatar !== 'users/defaults/avatar.jpg') {
            url = await this.s3Service.generatePresignedUrlUpdate(avatar, 'image/jpeg');
        } else{
            // If user using avt default, update link avt user profile
            const profile = user.profile;
            profile.avatar = `users/${user.id}/avatar.jpg`;
            await this.profileRepository.updateInstace(profile);
            url = await this.s3Service.generatePresignedUrlUpdate(profile.avatar, 'image/jpeg');
        }
        url = await this.s3Service.generatePresignedUrlUpdate('ok.jpg', 'image/jpeg');

        return url;
    }

    async clearCacheAvatar(userId: number): Promise<void> {
        const user = await this.getUserInformation(userId);
        if (!user.profile) {
            throw new NotFound('Server error, Profile of user does not exist');
        }

        const avatar = user.profile.getDataValue('avatar');
        if(!avatar) {
            throw new ServerError('Server error');
        }

		return await this.s3Service.clearCacheCloudFront(avatar);
    }
}
