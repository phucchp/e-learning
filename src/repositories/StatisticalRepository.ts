import { Service } from "typedi";
import { Review } from "../models/Review";
import { IStatisticalRepository } from "./interfaces/IStatisticalRepository";
import { BaseRepository } from "./BaseRepository";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes, literal, OrderItem } from 'sequelize';
import { PaymentDetail } from "../models/PaymentDetail";
import { ServerError } from "../utils/CustomError";

@Service()
export class StatisticalRepository extends BaseRepository<PaymentDetail> implements IStatisticalRepository{

    constructor(){
		super(PaymentDetail);
	}

    /**
     * Thống kê doanh thu của instructors theo Ngày, Tuần, Tháng, Năm (All or one courses)
     * @param startDate 
     * @param endDate 
     * @param statisBy 
     * @param instructorId 
     * @param courseId 
     * @returns 
     */
    async getRevenueStatistics(startDate: string, endDate: string, statisBy: string, instructorId?: number, courseId?: number): Promise<any[]> {
            let filterByCourse = '';
            let filterByInstructor = '';
            if(courseId) {
                filterByCourse = `AND "payment_details"."course_id" = ${courseId}`
            }

            if(instructorId) {
                filterByInstructor = `AND "courses"."instructor_id" = '${instructorId}'`;
            }

            const sequelize = this.model.sequelize;
            if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT 
                ${this.getSelectExpression('payment_details', statisBy)} AS interval,
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
            JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
            JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
                ${filterByInstructor}
                ${filterByCourse}
            GROUP BY 
                interval
            ORDER BY 
                interval;
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }

    /**
     * Thống kê doanh thu của 1 instructor cụ thể or nhiều instructor -> theo khoá học
     * Nếu admin dùng thì có thể truyền or không truyền instructorID
     * Nếu truyền instructorId thì chỉ thống kê các khoá học của instructor đó
     * Nếu Instructor dùng bắt buộc truyền instructorId
     * @param startDate 
     * @param endDate 
     * @param statisBy 
     * @param instructorId 
     * @returns 
     */
    async getRevenueStatisticsByCourses(startDate: string, endDate: string, orderPrice: string, instructorId?: number): Promise<any[]> {
            let filterByInstructor = '';
            if(instructorId) {
                filterByInstructor = `AND "courses"."instructor_id" = ${instructorId}`
            }

            const sequelize = this.model.sequelize;
            if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT courses.course_id, courses.title, temp_table.total_price, courses.poster_url  FROM
            (SELECT 
                "payment_details"."course_id" AS courseId,
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
            JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
            JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
                ${filterByInstructor}
            GROUP BY 
                courseId
            ) AS temp_table
            JOIN courses ON temp_table.courseId = courses.id
            ORDER BY
                total_price ${orderPrice}
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }   

    getSelectExpression(table: string, statisBy: string): string {
        switch (statisBy) {
            case 'year':
                return `EXTRACT(YEAR FROM "${table}"."created_at")`;
            case 'month':
                return `DATE_TRUNC('month', "${table}"."created_at")`;
            case 'week':
                return `EXTRACT(WEEK FROM "${table}"."created_at")`;
            case 'day':
                return `DATE_TRUNC('day', "${table}"."created_at")`;
            default:
                throw new Error(`Invalid statisBy value: ${statisBy}`);
        }
    }

    /**
     * Thống kê xem instructor nào nhiều doanh thu nhất
     * @param startDate 
     * @param endDate 
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getRevenueStatisticsByInstructor(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]> {
            const sequelize = this.model.sequelize;
            if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT 
                "courses"."instructor_id" AS instructorId,
                "users"."user_name",
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
                JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
                JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
                JOIN "users" ON "users"."id" = "courses"."instructor_id"
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
            GROUP BY 
                instructorId, "users"."user_name"
            ORDER BY 
                ${sortBy} ${sortType};
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }

    /**
     * Thống kê số lượng khoá học theo từng chủ đề
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getStatisticsCoursesByCategory(sortBy: string, sortType: string): Promise<any[]> {
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT
                categories.id AS id,
                categories.category_id as categoryId,
                categories."name" as name,
                COUNT(categories.category_id) as totalCourses
            FROM 
                categories
            JOIN courses ON categories.id = courses.category_id
            GROUP BY categories.id, categories.category_id, categories."name"
            ORDER BY 
                ${sortBy} ${sortType};
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }

    /**
     * Thống kê số lượng khoá học theo từng level
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getStatisticsCoursesByLevel(sortBy: string, sortType: string): Promise<any[]> {
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT
                levels.id,
                levels.level_name,
                COUNT(levels.id) as totalCourses
            FROM 
                levels
            JOIN courses ON levels.id = courses.level_id
            GROUP BY levels.id, levels.level_name
            ORDER BY
                ${sortBy} ${sortType};
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }

    /**
     * Thống kê doanh thu theo từng category
     */
    async getRevenueStatisticsByCategory(startDate: string, endDate: string, sortBy: string, sortType: string): Promise<any[]> {
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT 
                "courses"."category_id" AS categoryId,
                categories."name",
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
            JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
            JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
            JOIN categories ON categories.id = courses.category_id
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
            GROUP BY 
                categoryId, categories."name"
            ORDER BY 
                ${sortBy} ${sortType};
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }

    /**
     * Thống kê doanh thu các khoá học trong một chủ đề
     * @param startDate 
     * @param endDate 
     * @param categoryId 
     * @param sortBy 
     * @param sortType 
     * @returns 
     */
    async getRevenueStatisticsCourseByCategory(startDate: string, endDate: string, categoryId: number, sortBy: string, sortType: string): Promise<any[]> {
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT courses.course_id, courses.title, temp_table.total_price, courses.poster_url  FROM
            (SELECT 
                payment_details.course_id AS courseId,
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
            JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
            JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
            JOIN categories ON categories.id = courses.category_id
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
                AND "courses"."category_id" = ${categoryId}
            GROUP BY 
                courseId
                ) AS temp_table
            JOIN courses ON temp_table.courseId = courses.id
            ORDER BY 
                ${sortBy} ${sortType};
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
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
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
            }
            return await sequelize.query(`
            SELECT courses.course_id, courses.title, temp_table.total_price, courses.poster_url  FROM
            (SELECT 
                payment_details.course_id AS courseId,
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
            JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
            JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
            JOIN "levels" ON "levels"."id" = "courses"."level_id"
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
                AND "courses"."level_id" = ${levelId}
            GROUP BY 
                courseId
                ) AS temp_table
            JOIN courses ON temp_table.courseId = courses.id
            ORDER BY
                total_price ${sortType}
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
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
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
        }
        return await sequelize.query(`
            SELECT 
                "levels"."id",
                "levels"."level_name",
                SUM("payment_details"."price") AS total_price
            FROM "payment_details"
            JOIN "courses" ON "courses"."id" = "payment_details"."course_id"
            JOIN "payments" ON "payments"."id" = "payment_details"."payment_id"
            JOIN levels ON levels.id = courses.level_id
            WHERE
                "payment_details"."created_at" BETWEEN '${startDate}' AND '${endDate}'
                AND "payments"."is_payment" = true
            GROUP BY 
                "levels"."id", "levels"."level_name"
            ORDER BY 
                ${sortBy} ${sortType};
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }

    /**
     * Thống kê tiền trong một tháng cho từng instructor
     * Dùng để chuyển tiền cho instructor dựa vào doanh thu của họ mỗi tháng
     */
    async calculateMonthlyRevenueByInstructor(): Promise<any[]> {
        const sequelize = this.model.sequelize;
        if(!sequelize){
                throw new ServerError('Server error!');
        }
        return await sequelize.query(`
        SELECT users.id, users.user_name,e_wallets.email as paymentMail, users.email AS userMail ,COUNT(payment_details.id) AS totalBills, 
            SUM(payment_details.price*(1-payment_details.discount/100)),
            ARRAY_AGG(payment_details.id) as list_payment_details_id
        FROM payments
        JOIN payment_details ON payments.id = payment_details.payment_id AND payments.is_payment = true
            AND EXTRACT(MONTH FROM payments.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM payments.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND payment_details.is_paid_to_instructor = false
        JOIN courses ON courses.id = payment_details.course_id
        JOIN users ON users.id = courses.instructor_id
        JOIN e_wallets ON e_wallets.user_id = users.id
        GROUP BY users.user_name, e_wallets.email, users.email, users.id;
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
    }
 }