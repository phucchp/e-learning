import { Inject, Service } from 'typedi';
import { IEWalletService } from './interfaces/IEWalletService';
import { EWallet } from '../models/EWallet';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { EWalletRepository } from '../repositories/EWalletRepository';
import { IEWalletRepository } from '../repositories/interfaces/IEWalletRepository';

@Service()
export class EWalletService implements IEWalletService {
    
    @Inject(() => EWalletRepository)
	private eWalletRepository!: IEWalletRepository;

    async getEWallet(userId: number): Promise<EWallet | null> {
        return await this.eWalletRepository.findOneByCondition({
            userId: userId,
            type: 'Paypal'
        });
    }

    async createEWallet(userId: number, email: string, type: string): Promise<EWallet> {
        const eWallet1 = await this.eWalletRepository.findOneByCondition({
            userId: userId,
            type: type
        });
        if(eWallet1) {
            throw new DuplicateError('At present, each user can only add one e-wallet!');
        }

        const eWallet = await this.eWalletRepository.findOneByCondition({
            email: email,
            type: type
        });

        if(eWallet) {
            throw new DuplicateError('EWallet already exists!');
        }

        return await this.eWalletRepository.create({
            userId: userId,
            email: email,
            type: type
        });
    }

    async updateEWallet(userId: number, newEmail: string, type: string): Promise<EWallet> {
        const eWallet = await this.eWalletRepository.findOneByCondition({
            userId: userId,
            type: type
        });

        if (!eWallet) {
            throw new NotFound('EWallet not found!');
        }

        eWallet.email = newEmail;
        const newEWallet = await this.eWalletRepository.updateInstance(eWallet);
        if (!newEWallet) {
            throw new ServerError('Error updating EWallet');
        }

        return newEWallet;
    }

    async deleteEWallet(eWalletId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
