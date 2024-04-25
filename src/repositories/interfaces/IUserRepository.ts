import { Course } from "../../models/Course";
import { User } from "../../models/User";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IUserRepository extends BaseRepositoryInterface<User> {
    getCarts(userId: number, search : string): Promise<{ rows: User[]; count: number}>;
    getFavoriteCourses(userId: number, search : string): Promise<{ rows: User[]; count: number}>;
    getUserInformation(userId: number): Promise<User>;
    getListInstructors(page: number, pageSize: number): Promise<{ rows: User[]; count: number; }>;
}