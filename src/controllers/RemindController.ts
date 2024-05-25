import { RemindService } from "../services/RemindService";
import { IRemindService } from "../services/interfaces/IRemindService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";

export class RemindController{
	private remindService: IRemindService;

	constructor() {
		this.remindService = Container.get(RemindService);
	}

    addRemind = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const lessonId = req.body.lessonId;
        const time =req.body.time;
        const newRemind = await this.remindService.addRemind(userId, lessonId, time);
        return res.status(200).json({
            message: "Successful",
            data: newRemind
        });
    }

    updateRemind = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const lessonId = req.body.lessonId;
        const time =req.body.time;
        const newRemind = await this.remindService.updateRemind(userId, lessonId, time);
        return res.status(200).json({
            message: "Successful",
            data: newRemind
        });
    }

    deleteRemind = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const lessonId = req.body.lessonId;
        await this.remindService.deleteRemind(userId, lessonId);
        return res.status(200).json({
            message: "Successful",
        });
    }
}