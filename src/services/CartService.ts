import { Inject, Service } from 'typedi';
import { ICartService } from './interfaces/ICartService';
import { Cart } from '../models/Cart';
import { CartRepository } from '../repositories/CartRepository';
import { ICartRepository } from '../repositories/interfaces/ICartRepository';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { BadRequestError, ContentNotFound, DuplicateError, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Op } from 'sequelize';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';

@Service()
export class CartService implements ICartService {

    @Inject(() => CartRepository)
	private cartRepository!: ICartRepository;

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => EnrollmentRepository)
	private enrollmentRepository!: IEnrollmentRepository;

    async deleteCoursesFromCart(userId: number, courseIds: string[]): Promise<number> {
        const courses = await this.courseRepository.getAll({
            where:{
                courseId: {
					[Op.in]:courseIds
				}
            }
        });
        const Ids: number[] = [];
        courses.forEach(course => {
            Ids.push(course.id);
        });
        if(Ids.length === 0) return 0;
        return await this.cartRepository.deleteCoursesFromCart(userId, Ids)
    }

    /**
     * Check course is available in cart of user
     */
    protected async isUserEnrollmentCourse(userId: number, courseId: number): Promise<boolean>{
        const enrollment = await this.enrollmentRepository.findOneByCondition({
            userId: userId,
            courseId: courseId
        },[], false);
        if(enrollment) return true;
        return false;
    }

    async addCourseToCart(userId: number, courseId: string): Promise<boolean> {
        // Kiểm tra course có tồn tại không
        // Kiểm tra course đã có trong cart hay chưa
        // Kiểm tra course user đã mua hay chưa, mua rồi thì không cho add vào cart
        // Nếu có thì kiểm tra trường deleteAt
        // Nếu deleteAt != null thì restore bản ghi đó
        // Nếu deleteAt == null thì throw lỗi 'Course đã có trong cart'
        const course = await this.courseRepository.findOneByCondition({
            courseId: courseId
        })

        if(!course){ // Check course is exist
            throw new NotFound('Course not found!');
        }

        if(await this.isUserEnrollmentCourse(userId,course.id)){
            throw new BadRequestError('Purchased courses cannot be added to cart');
        }

        const cart = await this.cartRepository.findOneByCondition({
            userId: userId,
            courseId: course.id
        },[], false);

        if(!cart){ // Check course is already in cart
            const newData = await this.cartRepository.create({
                userId: userId,
                courseId: course.id
            })
            return true;
        }

        if(cart.deletedAt == null){
            throw new DuplicateError('The course is already in the cart');
        }

        await this.cartRepository.restore(cart);
        return true;
    }

    async isCourseInCartUser(userId: number, courseId: number): Promise<boolean> {
        const cart = await this.cartRepository.findOneByCondition({
            userId: userId,
            courseId: courseId
        },[], false);
        console.log(cart);
        if(!cart){ // Check course is already in cart
            return false;
        }

        if(cart.deletedAt != null){ // Check course is already in cart
            return false;
        }
        
        return true;
    }
}