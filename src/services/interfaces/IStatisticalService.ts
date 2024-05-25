import { PaymentDetail } from "../../models/PaymentDetail";
import { Request} from 'express';

export interface IStatisticalService {
    getRevenueStatistics(startDate: string, endDate: string, statisBy: string, instructorId?: number, courseId?: number) : Promise<any[]>;
    getRevenueStatisticsByCourses(startDate: string, endDate: string, orderPrice: string, instructorId?: number): Promise<any[]>;
    getRevenueStatisticsByInstructor(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>;
    // By category
    getStatisticsCoursesByCategory(sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsByCategory(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsCourseByCategory(startDate: string, endDate: string, categoryId: number, sortBy: string, sortType: string): Promise<any[]>;
    //By level
    getRevenueStatisticsByLevel(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>;
    getStatisticsCoursesByLevel(sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsCourseByLevel(startDate: string, endDate: string, levelId: number, sortType: string): Promise<any[]>;
}