import { IEWalletService } from "../services/interfaces/IEWalletService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { EWalletService } from "../services/EWalletService";

export class EWalletController{
	private eWalletService: IEWalletService;

	constructor() {
		this.eWalletService = Container.get(EWalletService);
	}

	getEWallet = async (req: Request, res: Response) => {
		const userId = req.payload.userId;
		const data = await this.eWalletService.getEWallet(userId);
		return res.status(200).json({
			message: "Successful",
			data: data
		});
	}

	createEWallet = async (req: Request, res: Response) => {
		const userId = req.payload.userId;
		const email = req.body.email;
		const data = await this.eWalletService.createEWallet(userId, email , 'Paypal');
		return res.status(202).json({
			message: "Successful",
			data: data
		});
	}

	updateEWallet = async (req: Request, res: Response) => {
		const userId = req.payload.userId;
		const email = req.body.email;
		const data = await this.eWalletService.updateEWallet(userId, email , 'Paypal');
		return res.status(200).json({
			message: "Successful",
			data: data
		});
	}

}