import { Inject, Service } from 'typedi';
import { IStatisticalService } from './interfaces/IStatisticalService';
import { PaymentDetail } from '../models/PaymentDetail';
import { Request } from 'express';
import { StatisticalRepository } from '../repositories/StatisticalRepository';
import { IStatisticalRepository } from '../repositories/interfaces/IStatisticalRepository';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Service()
export class StatisticalService implements IStatisticalService {
    
    @Inject(() => StatisticalRepository)
	private statisticalRepository!: IStatisticalRepository;

    /**
     * Thống kê doanh thu theo ngày tháng năm tuần, có thể thống kê theo all or từng khoá học
     * @param req 
     * @returns 
     */
    async getRevenueStatistics(startDate: string, endDate: string, statisBy: string, instructorId?: number, courseId?: number): Promise<any[]> {
        const result = await this.statisticalRepository.getRevenueStatistics(startDate, endDate, statisBy, instructorId, courseId);
        return result;
    }

    /**
     * Thống kê doanh thu theo từng khoá học
     * @param startDate 
     * @param endDate 
     * @param orderPrice 
     * @param instructorId 
     * @returns 
     */
    async getRevenueStatisticsByCourses(startDate: string, endDate: string, orderPrice: string, instructorId?: number): Promise<any[]> {
        const result = await this.statisticalRepository.getRevenueStatisticsByCourses(startDate, endDate, orderPrice, instructorId);
        return result;
    }

    /**
     * For Admin
     * Thống kê doanh thu của từng instructor xem instructor nào có nhiều doanh thu nhất
     * @param startDate 
     * @param endDate 
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getRevenueStatisticsByInstructor(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]> {
        const result = await this.statisticalRepository.getRevenueStatisticsByInstructor(startDate, endDate, sortBy, sortType);
        return result;
    }

    /**
     * Thống kê số lượng khoá học theo từng chủ đề
     * @param sortBy 
     * @param sortType 
     */
    async getStatisticsCoursesByCategory(sortBy: string, sortType: string): Promise<any[]> {
        return await this.statisticalRepository.getStatisticsCoursesByCategory(sortBy, sortType);
    }

    /**
     * Thống kê doanh thu theo từng category
     * @param startDate 
     * @param endDate 
     * @param sortBy 
     * @param sortType 
     */
    async getRevenueStatisticsByCategory(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]>{
        return await this.statisticalRepository.getRevenueStatisticsByCategory(startDate, endDate, sortBy, sortType);
    }

    /**
     * Thống kê doanh thu các khoá học trong một chủ đề
     * @param startDate 
     * @param endDate 
     * @param categoryId 
     * @param sortBy 
     * @param sortType 
     */
    async getRevenueStatisticsCourseByCategory(startDate: string, endDate: string, categoryId: number, sortBy: string, sortType: string): Promise<any[]>{
        return await this.statisticalRepository.getRevenueStatisticsCourseByCategory(startDate, endDate, categoryId, sortBy, sortType);
        
    }

    /**
     * Thống kê doanh thu theo từng level
     * @param startDate 
     * @param endDate 
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getRevenueStatisticsByLevel(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]> {
        return await this.statisticalRepository.getRevenueStatisticsByLevel(startDate, endDate, sortBy, sortType);
    }

    /**
     * Thống kê số lượng khoá học theo từng level
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getStatisticsCoursesByLevel(sortBy: string, sortType: string): Promise<any[]> {
        return await this.statisticalRepository.getStatisticsCoursesByLevel(sortBy, sortType);
    }

    /**
     * Thống kê doanh thu các khoá học trong một level
     * @param startDate 
     * @param endDate 
     * @param levelId 
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getRevenueStatisticsCourseByLevel(startDate: string, endDate: string, levelId: number, sortType: string): Promise<any[]> {
        return await this.statisticalRepository.getRevenueStatisticsCourseByLevel(startDate, endDate, levelId, sortType);
    }
}