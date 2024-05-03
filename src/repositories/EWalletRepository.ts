import { Service } from "typedi";
import { EWallet } from "../models/EWallet";
import { IEWalletRepository } from "./interfaces/IEWalletRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class EWalletRepository extends BaseRepository<EWallet> implements IEWalletRepository{

    constructor(){
		super(EWallet);
	}
}