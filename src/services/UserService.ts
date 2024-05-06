import { Inject, Service } from 'typedi';
import { IUserService } from './interfaces/IUserService';
import { User } from '../models/User';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { HandleS3 } from './utils/HandleS3';
import { S3Service } from './S3Service';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { IProfileRepository } from '../repositories/interfaces/IProfileRepository';
import { Profile } from '../models/Profile';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { IEnrollmentRepository } from '../repositories/interfaces/IEnrollmentRepository';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { IPaymentRepository } from '../repositories/interfaces/IPaymentRepository';
import { Op } from 'sequelize';
import { ProcessingRepository } from '../repositories/ProcessingRepository';
import { IProcessingRepository } from '../repositories/interfaces/IProcessingRepository';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';

@Service()
export class UserService implements IUserService {
    
    @Inject(() => UserRepository)
	private userRepository!: IUserRepository;

    @Inject(() => ProfileRepository)
	private profileRepository!: IProfileRepository;

    @Inject(() => EnrollmentRepository)
	private enrollmentRepository!: IEnrollmentRepository;

    @Inject(() => PaymentRepository)
	private paymentRepository!: IPaymentRepository;

    @Inject(() => ProcessingRepository)
	private processingRepository!: IProcessingRepository;

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    @Inject(() => HandleS3)
	private handleS3!: HandleS3;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    async isAdmin(userId: number): Promise<boolean>{
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new NotFound('User not found or is not actived');
        }
        if(user.roleId===3){
            return true;
        }
        return false;
    }

    async isInstructor(userId: number): Promise<boolean>{
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new NotFound('User not found or is not actived');
        }
        if(user.roleId===2 || user.roleId===3){
            return true;
        }
        return false;
    }

    async getCarts(userId: number, search: string): Promise<{ rows: User[]; count: number; }> {
        const {rows, count} = await this.userRepository.getCarts(userId, search);
        if(rows.length > 0) {
            if(rows[0].carts.length > 0) {
                rows[0].setDataValue('carts', await this.handleS3.getResourceCourses(rows[0].carts));
            }
        }
        return {rows, count};
    }

    async getFavoriteCourses(userId: number, search: string): Promise<{ rows: User[]; count: number; }> {
        let data = await this.userRepository.getFavoriteCourses(userId, search);
        
        if (data.rows.length >= 1 && data.rows !== undefined) {
            console.log(data.rows);
            const courses = data.rows[0].getDataValue('favorites');
            data.rows[0].setDataValue('favorites', await this.handleS3.getResourceCourses(courses));
        }

        return data;
    }

    async getUserInformation(userId: number): Promise<User> {
        return await this.userRepository.getUserInformation(userId);
    }

    async getPresignUrlToUploadAvatar(userId: number): Promise<string> {
        const user = await this.getUserInformation(userId);
        let url = '';
        if (!user.profile) {
            throw new NotFound('Server error, Profile of user does not exist');
        }

        const avatar = user.profile.getDataValue('avatar');
        if (avatar && avatar !== 'users/defaults/avatar.jpg') {
            url = await this.s3Service.generatePresignedUrlUpdate(avatar, 'image/jpeg');
        } else{
            // If user using avt default, update link avt user profile
            const profile = user.profile;
            profile.avatar = `users/${user.id}/avatar.jpg`;
            await this.profileRepository.updateInstance(profile);
            url = await this.s3Service.generatePresignedUrlUpdate(profile.avatar, 'image/jpeg');
        }
        url = await this.s3Service.generatePresignedUrlUpdate('ok.jpg', 'image/jpeg');

        return url;
    }

    async clearCacheAvatar(userId: number): Promise<void> {
        const user = await this.getUserInformation(userId);
        if (!user.profile) {
            throw new NotFound('Server error, Profile of user does not exist');
        }

        const avatar = user.profile.getDataValue('avatar');
        if(!avatar) {
            throw new ServerError('Server error');
        }

		return await this.s3Service.clearCacheCloudFront(avatar);
    }

    async getListInstructors(req: Request): Promise<{ rows: User[]; count: number; }> {
        const page  = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const results = await this.userRepository.getListInstructors(page, pageSize);
        if (results.rows.length > 0) {
            for (const user of results.rows) {
                if (!user.profile) {
                    throw new ServerError('Profile user is missing!');
                }
                user.setDataValue('profile', await this.handleS3.getAvatarUser(user.profile));
            }
        }

        return results;
    }

    async getInstructorDetail(instructorId: number): Promise<Profile> {
       const profile = await this.profileRepository.findById(instructorId);
        
       if (!profile) {
        throw new NotFound("Profile not found!");
       }

       return await this.handleS3.getAvatarUser(profile);
    }

    async updateUserInformation(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Profile> {
        const userId = req.payload.userId;
        const {firstName, lastName, description} = req.body;
        const profile = await this.profileRepository.findOneByCondition({
            userId: userId
        });

        if (!profile) {
            throw new NotFound("Profile not found!");
        }

        if (firstName) {
            profile.firstName = firstName;
        }

        if (lastName) {
            profile.firstName = lastName;
        }

        if (description) {
            profile.description = description;
        }

        const newProfile = await this.profileRepository.updateInstance(profile);
        if (!newProfile) {
            throw new ServerError('Error updating profile!');
        }

        return newProfile;
    }

    async getUsers(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<{ rows: User[]; count: number; }> {
        const {search,isActive, roleId, page, pageSize, sortBy, sortType} = req.query;
        const whereCondition: any = {};
        if(search){
            whereCondition[Op.or] = [
                { userName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if(isActive){
            whereCondition['isActive'] = {[Op.eq]: isActive};
        }

        if(roleId){
            whereCondition['roleId'] = {[Op.eq]: roleId};
        }

        const options = {
            page: page || 1,
            pageSize: pageSize || 10,
            whereCondition: whereCondition,
            sortType: sortType || 'ASC',
            sort : sortBy || 'id'
        }
        // Sort: id, createdAt, roleId
        // Search by username, email
        const results = await this.userRepository.getUsers(options);
        if (results.rows.length > 0) {
            for (const user of results.rows) {
                if (!user.profile) {
                    throw new ServerError('Profile user is missing!');
                }
                user.setDataValue('profile', await this.handleS3.getAvatarUser(user.profile));
            }
        }
        return results;
    }

    /**
     * Get all information of user for administrator
     * @param userId 
     * @returns 
     */
    async getUser(userId: number): Promise<User> {
        const user = await this.userRepository.getUser(userId);

        if (!user.profile) {
            throw new ServerError('Profile user is missing!');
        }
        user.setDataValue('profile', await this.handleS3.getAvatarUser(user.profile));
        return user;
    }

    /**
     * Get total courses enrollment of user
     * @param userId 
     * @returns 
     */
    async getTotalCoursesEnrollment(userId: number): Promise<number> {
        const totalCoursesEnrollment = await this.enrollmentRepository.getEnrollmentCoursesOfUser(userId);
        return totalCoursesEnrollment.count;
    }

    /**
     * Get total amount is paid of user
     * @param userId 
     * @returns 
     */
    async getTotalAmountPaid(userId: number): Promise<{totalPayment: number, totalAmount: number}> {
        const {rows, count} = await this.paymentRepository.getPaymentOfUser(userId);
        let totalAmount = 0;
        for (const payment of rows) {
            totalAmount += payment.price;
        }

        return {
            totalPayment : count,
            totalAmount : totalAmount
        }
    }

    /**
     * Statistics on how many % of a course a user has learned
     * @param userId 
     */
    async getCompletionPercentageCourse(userId: number, courseId: string): Promise<{
        percent: number,
        totalLesson: number,
        totalDone: number
    }> {
        const lessonIds = await this.courseService.getLessonIdsOfCourse(courseId);
        const processing = await this.processingRepository.getAll({
            where: {
                userId: userId,
                lessonId: {
					[Op.in]:lessonIds
				},
                isDone: true
            }
        });

        return {
            percent: (processing.length / lessonIds.length)* 100,
            totalLesson: lessonIds.length,
            totalDone: processing.length
        };
    }
}
