import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { OtherService } from "../services/OtherService";
import { RedisService } from '../services/RedisService';
import { CollaborativeFiltering } from '../services/CollaborativeFiltering';
import { ContentBasedRecommendSystem } from '../services/ContentBasedRecommendSystem';

export class OtherController{
	private otherService: OtherService;
	private redisService: RedisService;
	private collaborativeFiltering: CollaborativeFiltering;
    private contentBased: ContentBasedRecommendSystem;

	constructor() {
		this.otherService = Container.get(OtherService);
		this.redisService = Container.get(RedisService);
		this.collaborativeFiltering = Container.get(CollaborativeFiltering);
		this.contentBased = Container.get(ContentBasedRecommendSystem);
	}

    createDataCourse = async (req: Request, res: Response) => {
        await this.otherService.readDirRecursive('../new-big-data');
        return res.status(200).json({
            message: "Success",
        });
    }

    clearCacheContentBaseRcm = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        const cacheKey = `getCoursesRecommendBasedOnCollaborativeFiltering/users/${userId}`;
        const cacheKey2 = `getCoursesRecommendBasedOnTags/users/${userId}`;
        await this.redisService.clearCacheByKey(cacheKey);
        await this.redisService.clearCacheByKey(cacheKey2);
        return res.status(200).json({
            message: "Successfully"
        });
    }

    clearCacheAllCache = async (req: Request, res: Response) => {
        await this.redisService.clearAllCache();
        return res.status(200).json({
            message: "Successfully"
        });

    }

    getMatrixCollaborative = async (req: Request, res: Response) => {
        const rs = await this.collaborativeFiltering.createMatrix();
        return res.status(200).json({
            message: "Successfully",
            data: rs
        });
    }

    getMatrixContentBased = async (req: Request, res: Response) => {
        const rs = await this.contentBased.createMatrix();
        return res.status(200).json({
            message: "Successfully",
            data: rs
        });
    }

    clearCacheContentCollaborative = async (req: Request, res: Response) => {
        
    }
}