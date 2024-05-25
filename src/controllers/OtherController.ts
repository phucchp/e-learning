import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { OtherService } from "../services/OtherService";

export class OtherController{
	private otherService: OtherService;

	constructor() {
		this.otherService = Container.get(OtherService);
	}

    createDataCourse = async (req: Request, res: Response) => {
        await this.otherService.readDirRecursive('../new-big-data');
        return res.status(200).json({
            message: "Success",
        });
    }

}