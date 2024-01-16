import { Service } from "typedi";
import { Course } from "../models/Course";
import { ICourseRepository } from "./interfaces/ICourseRepository";
import { BaseRepository } from "./BaseRepository";
import { Language } from "../models/Language";
import { Level } from "../models/Level";
import { Category } from "../models/Category";
import { User } from "../models/User";
import { Profile } from "../models/Profile";

@Service()
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository{

    constructor(){
		super(Course);
	}

    async getCourses(page: number = 1, pageSize: number = 10): Promise<Course[]> {
        try {
            const offset = (page - 1) * pageSize;
            const courses = await this.model.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: Language,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: Level,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: Category,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: User,
                        as: 'instructor', // Alias của BelongsTo
                        attributes: ['userName'],
                        include: [
                            {
                                model: Profile,
                                attributes: ['fullName','firstName', 'lastName', 'avatar', 'description'],
                            },
                        ],
                    }
                ],
                limit: pageSize,
                offset: offset,
            });
            return courses;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}