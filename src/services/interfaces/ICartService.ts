import { StringDecoder } from "string_decoder";
import { Cart } from "../../models/Cart";
import { Request} from 'express';

export interface ICartService {
    deleteCoursesFromCart(userId: number, courseIds: string[]): Promise<number>;
    addCourseToCart(userId: number, courseId: string): Promise<boolean>;
    isCourseInCartUser(userId: number, courseId: number): Promise<boolean>;
}