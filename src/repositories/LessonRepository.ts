import { Service } from "typedi";
import { Lesson } from "../models/Lesson";
import { ILessonRepository } from "./interfaces/ILessonRepository";
import { BaseRepository } from "./BaseRepository";
import { Note } from "../models/Note";
import { Remind } from "../models/Remind";
import { Comment } from "../models/Comment";

@Service()
export class LessonRepository extends BaseRepository<Lesson> implements ILessonRepository{

    constructor(){
		super(Lesson);
	}

	async getLessonDetails(lessonId: number): Promise<Lesson|null> {
		return await this.model.findOne({
			where: {
                id: lessonId
            },
			include: [
                {
                    model: Note,
                },
				{
                    model: Comment,
                },
				{
                    model: Remind,
                },
			],
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
		});
	}

	async createLessons(lessons: any[]): Promise<Lesson[]> {
		return await this.model.bulkCreate(lessons);
	}
}