import { EWallet } from "../../models/EWallet";
import { Request} from 'express';

export interface IEWalletService {
    getEWallet(userId: number): Promise<EWallet|null>;
    createEWallet(userId: number, email: string, type: string): Promise<EWallet>;
    updateEWallet(userId: number, newEmail: string, type: string): Promise<EWallet>;
    deleteEWallet(eWalletId: string): Promise<void>;
}