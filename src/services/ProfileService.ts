import { Inject, Service } from 'typedi';
import { IProfileService } from './interfaces/IProfileService';
import { Profile } from '../models/Profile';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { IProfileRepository } from '../repositories/interfaces/IProfileRepository';

@Service()
export class ProfileService implements IProfileService {

    @Inject(() => ProfileRepository)
	private profileRepository!: IProfileRepository;

    async createProfile(): Promise<Profile> {
        throw new Error('Method not implemented.');
    }
    async updateProfile(): Promise<Profile> {
        throw new Error('Method not implemented.');
    }
}