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

    deleteNamespace = async (req: Request, res: Response) => {
        const namespace = req.query.namespace;
        if (!namespace) {
            return res.status(404).json({
                "message" : "Missing namespace"
            })
        }
        console.log(`deleteNamespace ${namespace}`);
        await this.pineconeService.deleteNamespace(namespace.toString());
        return res.json({
            "message" : "Success"
        });
    }

}