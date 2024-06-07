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
import { NotFound } from "../utils/CustomError";
import { Op, Sequelize } from 'sequelize';
import { Tag } from "../models/Tag";
import { CourseTag } from "../models/CourseTag";
import { Resource } from "../models/Resource";

@Service()
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository{

    constructor(){
		super(Course);
	}

    async getCourses(options: any): Promise<{ rows: Course[]; count: number}> {
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
                            attributes: ['fullName','firstName', 'lastName', 'avatar'],
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
    }

    async getCourse(courseId: string): Promise<Course|null> {
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
                                    attributes: ['fullName','firstName', 'lastName', 'avatar'],
                                },
                            ],
                            attributes: ['userName'], 
                        }
                    ],
                    limit : 10
                },
                {
                    model: Topic,
                    attributes: ['id' ,'name'], 
                    include: [
                        {
                            model: Lesson,
                            attributes: ['id' ,'title', 'duration', 'isPreview'],
                            include: [
                                {
                                    model: Resource,
                                    attributes: ['url' , 'deletedAt'],
                                },
                            ],
                        },
                    ],
                }
               
            ],
            order: [
                // We start the order array with the model we want to sort
                [{ model: Topic, as: 'topics' }, 'id', 'ASC'],
            ],
        });
        return course;
    }

    async getAllLessonOfCourse(courseId: string): Promise<Course> {
        const course = await this.model.findOne({
            where: {
                courseId: courseId
            },
            include: [
                {
                    model: Topic,
                    attributes: ['id' ,'name'], 
                    include: [
                        {
                            model: Lesson,
                            attributes: ['id' ,'title', 'duration', 'isPreview'],
                        },
                    ],
                }
               
            ],
            
        });

        if(!course) {
            throw new NotFound('Course not found!');
        }

        return course;
    }

    async getCoursesRecommend(courseIds: number[], page: number, pageSize: number): Promise<{ rows: Course[]; count: number}> {
        const offset = (page - 1) * pageSize;
        const courses = await this.model.findAndCountAll({
            attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
            where: {
                id:courseIds
            },
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
                            attributes: ['fullName','firstName', 'lastName', 'avatar'],
                        },
                    ],
                },
            ],
            limit: pageSize,
            offset: offset,
            order: 
					[
					  Sequelize.literal(
						`CASE ${courseIds
						  .map((id, index) => `WHEN "Course"."id" = ${id} THEN ${index}`)
						  .join(' ')}
						END`
					  )
					]
				  ,
        });
        return courses;
    }

    async getIdByCourseIdsString(courseIdsString: string[]): Promise<Course[]> {
        const courses = await this.model.findAll({
            attributes: ['id', 'courseId'],
            where: {
                courseId: courseIdsString
            }
        });
        return courses;
    }

    async getCoursesByCourseIds(courseIds: string[]): Promise<{ rows: Course[]; count: number}> {
        const courses = await this.model.findAndCountAll({
            attributes: { exclude: ['id', 'updatedAt', 'deletedAt'] },
            where: {
                courseId: courseIds
            },
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
                            attributes: ['fullName','firstName', 'lastName', 'avatar'],
                        },
                    ],
                },
            ],
        });
        return courses;
    }

    async getCoursesByTags(tags: string[]):Promise<{ rows: Course[]; count: number}> {
        const courses = await this.model.findAndCountAll({
            attributes: ['courseId', 'updatedAt', 'introduction'],
            include: [
                {
                    model: CourseTag,
                    include: [
                        {
                            model: Tag,
                            where:{
                                name: tags
                            }
                        },
                    ],
                },
               
            ],
            limit: 50,
        });
        return courses;
    }
}
