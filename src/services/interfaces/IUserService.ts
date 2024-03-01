import { User } from "../../models/User";
import { Request} from 'express';

export interface IUserService {
    getUsers(req: Request): Promise<User[]>;
    getUser(req: Request): Promise<User>;
    getCarts(userId: number, search : string): Promise<{ rows: User[]; count: number}>;
}