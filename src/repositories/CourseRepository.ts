import { Service } from "typedi";
import { Course } from "../models/Course";
import { ICourseRepository } from "./interfaces/ICourseRepository";
import { BaseRepository } from "./BaseRepository";
import { Language } from "../models/Language";
import { Level } from "../models/Level";
import { Category } from "../models/Category";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Topic } from "../models/Topic";
import { Lesson } from "../models/Lesson";
import { Review } from "../models/Review";

@Service()
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository{

    constructor(){
		super(Course);
	}

    async getCourses(options: any): Promise<{ rows: Course[]; count: number}> {
        try {
            const {page, pageSize, whereCondition, sort, sortType} = options;
            const offset = (page - 1) * pageSize;
            const courses = await this.model.findAndCountAll({
                attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
                where: whereCondition,
                include: [
                    {
                        model: Language,
                        attributes: { exclude: ['id','createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: Level,
                        attributes: { exclude: ['id','createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: Category,
                        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: User,
                        as: 'instructor', // Alias của BelongsTo
                        attributes: ['userName'],
                        include: [
                            {
                                model: Profile,
                                attributes: ['fullName', 'avatar'],
                            },
                        ],
                    },
                    // {
                    //     model: User, 
                    //     as: 'favorites',
                    //     through: { attributes: [] }, // Đặt attributes là một mảng rỗng để bỏ qua các cột không cần thiết
                    //     attributes: ['id', 'userName', 'email', 'password', 'isActive', 'roleId', 'createdAt', 'updatedAt'], // Thêm các cột cần lấy từ bảng 'users'
                    // },
                    // {
                    //     model: User, 
                    //     as: 'reviews',
                    //     through: { attributes: ['review'] }, // Đặt attributes là một mảng rỗng để bỏ qua các cột không cần thiết
                    //     attributes: ['id', 'userName', 'email', 'password', 'isActive', 'roleId', 'createdAt', 'updatedAt'], // Thêm các cột cần lấy từ bảng 'users'
                    // },
                ],
                limit: pageSize,
                offset: offset,
                order: [
                    [sort, sortType],
                    ['id', 'ASC']
                ]
            });
            return courses;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getCourse(courseId: string): Promise<Course|null> {
        try{
            const course = await this.model.findOne({
                where: {
                    courseId: courseId
                },
                attributes: { exclude: ['id', 'deletedAt'] },
                include: [
                    {
                        model: Language,
                        attributes: { exclude: ['id','createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: Level,
                        attributes: { exclude: ['id','createdAt', 'updatedAt', 'deletedAt'] },
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
                    },
                    {
                        model: Review, 
                        include: [
                            {
                                model: User,
                                include: [
                                    {
                                        model: Profile,
                                        attributes: ['fullName', 'avatar'],
                                    },
                                ],
                                attributes: ['userName'], 
                            }
                        ],
                        limit : 10
                    },
                    {
                        model: Topic,
                        attributes: ['name'], 
                        include: [
                            {
                                model: Lesson,
                                attributes: ['title', 'duration', 'isPreview'],
                            },
                        ],
                    }

                ],

            });
            return course;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    
}