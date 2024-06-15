import { PaypalService } from "../services/PaypalService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { PineconeService } from "../services/PineconeService";

export class PineconeController{
	private pineconeService: PineconeService;

	constructor() {
		this.pineconeService = Container.get(PineconeService);
	}

    pushDataToPinecone = async (req: Request, res: Response) => {
        await this.pineconeService.pushDataToPinecone();
        return res.status(200).json({
            "message": "Success",
        });
    }
}