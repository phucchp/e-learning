import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { ChatService } from '../services/ChatService';

export class ChatController{
	private chatService: ChatService;

	constructor() {
		this.chatService = Container.get(ChatService);
	}

    chat = async (req: Request, res: Response) => {
        const response = await this.chatService.chat(req);
        return res.status(200).json({
            "message": "Success",
            "response": response
        });
    }
}
