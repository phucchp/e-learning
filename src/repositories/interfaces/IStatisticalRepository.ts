import { PaymentDetail } from '../../models/PaymentDetail';
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";
import { Model, ModelCtor } from 'sequelize-typescript';

export interface IStatisticalRepository extends BaseRepositoryInterface<PaymentDetail> {
    getRevenueStatistics(startDate: string, enđate: string, statisBy: string, instructorId?: number, courseId?: number): Promise<any[]>;
    getRevenueStatisticsByCourses(startDate: string, endDate: string, orderPrice: string, instructorId?: number): Promise<any[]> ;
    getRevenueStatisticsByInstructor(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>;
    getStatisticsCoursesByCategory(sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsByCategory(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsCourseByCategory(startDate: string, endDate: string, categoryId: number, sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsByLevel(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>;
    getStatisticsCoursesByLevel(sortBy: string, sortType: string): Promise<any[]>;
    getRevenueStatisticsCourseByLevel(startDate: string, endDate: string, levelId: number, sortType: string): Promise<any[]>;
    calculateMonthlyRevenueByInstructor(): Promise<any[]>; // Thống kê tiền trong 1 tháng của từng instructor
}
