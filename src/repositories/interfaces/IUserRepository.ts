import { Course } from "../../models/Course";
import { User } from "../../models/User";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface IUserRepository extends BaseRepositoryInterface<User> {
    getCarts(userId: number, search : string): Promise<{ rows: User[]; count: number}>;
}