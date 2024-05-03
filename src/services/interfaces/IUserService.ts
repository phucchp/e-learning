import { Profile } from "../../models/Profile";
import { User } from "../../models/User";
import { Request} from 'express';

export interface IUserService {
    getUsers(req: Request): Promise<User[]>;
    getUser(req: Request): Promise<User>;
    getCarts(userId: number, search : string): Promise<{ rows: User[]; count: number}>;
    isAdmin(userId: number): Promise<boolean>;
    isInstructor(userId: number): Promise<boolean>;
    getUserInformation(userId: number): Promise<User>;
    getFavoriteCourses(userId: number, search : string): Promise<{ rows: User[]; count: number}>;
    getPresignUrlToUploadAvatar(userId: number): Promise<string>;
    clearCacheAvatar(userId: number): Promise<void>;
    getListInstructors(req: Request): Promise<{ rows: User[]; count: number; }>;
    getInstructorDetail(instructorId: number): Promise<Profile>;
    updateUserInformation(req: Request): Promise<Profile>;
}