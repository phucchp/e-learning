import { Inject, Service } from 'typedi';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { Op } from 'sequelize';
import { CourseRepository } from '../repositories/CourseRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { ILessonRepository } from '../repositories/interfaces/ILessonRepository';
import { ITopicRepository } from '../repositories/interfaces/ITopicRepository';
import { S3Service } from './S3Service';
import fs from 'fs';
import path from 'path';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { TopicService } from './TopicService';
import { ITopicService } from './interfaces/ITopicService';
import axios from 'axios';

@Service()
export class OtherService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => LessonRepository)
	private lessonRepository!: ILessonRepository;

    @Inject(() => TopicRepository)
	private topicRepository!: ITopicRepository;

    @Inject(() => TopicService)
	private topicService!: ITopicService;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    @Inject(() => CategoryRepository)
	private categoryRepository!: ICategoryRepository;

    private generateCategoryId(name: string): string {
        // Chuyển tên thành viết thường và thêm dấu gạch ngang
        const lowerCaseName = name.toLowerCase();
        const dashedName = lowerCaseName.replace(/\s+/g, '-');
      
        // Tạo mã hash SHA-256 từ tên đã được xử lý
        const hash = crypto.createHash('sha256');
        const hashedCategoryId = hash.update(dashedName).digest('hex').slice(0,8);
      
        // Kết hợp tên đã xử lý và mã hash để tạo categoryId
        return `${dashedName}-${hashedCategoryId}`;
    }

    private async putImageToS3(posterUrl: string, posterPath: string) {
        // Get pre-signed URL
        const presignUrl = await this.s3Service.generatePresignedUrlUpdate(posterUrl, 'image/jpeg');
        // Using pre-signed URL to put the poster to S3
        const fileContent = fs.readFileSync(posterPath);
        
        await axios.put(presignUrl, 'image/jpeg', { headers: { 'Content-Type': 'image/jpeg' } });

    }


    private generateCourseId(name: string): string {
        // Chuyển tên thành viết thường và thêm dấu gạch ngang
        const lowerCaseName = name.toLowerCase();
        const dashedName = lowerCaseName.replace(/\s+/g, '-');
      
        // Tạo mã hash SHA-256 từ tên đã được xử lý
        const hash = crypto.createHash('sha256');
        const hashedCategoryId = hash.update(dashedName).digest('hex').slice(0,8);
      
        // Kết hợp tên đã xử lý và mã hash để tạo categoryId
        return `${dashedName}-${hashedCategoryId}`;
    }
      
    getDurationInSeconds(str: string): number {
        // Sử dụng biểu thức chính quy để tìm kiếm thời lượng
        const match = str.match(/(\d+h\s\d+m)/);
        if (match) {
            // Tách giờ và phút từ chuỗi kết quả
            const [hours, minutes] = match[0].split(/[h\s]+/);
            // Chuyển đổi giờ và phút thành giây và tính tổng
            const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
            return totalSeconds;
        }
        return 0; // Trả về 0 nếu không tìm thấy
    }

    // Hàm để cắt số bài giảng từ chuỗi
    getLectureCount(str: string): number {
        // Sử dụng biểu thức chính quy để tìm kiếm số bài giảng
        const match = str.match(/(\d+) lectures/);
        if (match) {
            // Lấy số bài giảng từ kết quả
            const lectureCount = parseInt(match[1], 10);
            return lectureCount;
        }
        return 0; // Trả về 0 nếu không tìm thấy
    }

    // Hàm để cắt thời gian từ cuối mỗi chuỗi và chuyển đổi thành số
    getTimeInSeconds(string: string) {
        // Sử dụng biểu thức chính quy để tìm kiếm thời gian
        const match = string.match(/(\d{2}):(\d{2})$/);
        if (match) {
            // Tách phút và giây từ chuỗi kết quả
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            // Chuyển đổi thời gian thành giây và tính tổng
            const totalSeconds = minutes * 60 + seconds;
            return totalSeconds;
        }
        return 0; // Trả về 0 nếu không tìm thấy
    }

    /**
     * Get random levelId for course
     * @returns 
     */
    getRandomLevelId() {
        // Tạo số ngẫu nhiên từ 0 đến 3
        const randomNumber = Math.floor(Math.random() * 4);
        // Thêm 1 để có số ngẫu nhiên từ 1 đến 4
        return randomNumber + 1;
    }

    async readDirRecursive(dir: string) {
        fs.readdirSync(dir).forEach(async file => {
            const categoryPath = path.join(dir, file); // Path of category
            const categoryName = file; // Get category name
            // CREATE CATEGORY
            const categoryId = this.generateCategoryId(categoryName);
            const newCategory = await this.categoryRepository.create({
                categoryId: categoryId,
                name: categoryName
            });

            // Lặp qua các thể loại (Category)
            fs.readdirSync(categoryPath).forEach(async course => {
                // Đường dẫn tới tệp hoặc thư mục
                const coursePath = path.join(categoryPath, course);
                const courseName = course;
                const instructorId = 1; //Random instructor
                // // Kiểm tra xem nó là thư mục hay tệp
                if (fs.statSync(coursePath).isDirectory()) {
                    // Get course details information
                    const title = fs.readFileSync(path.join(coursePath, 'title.txt'), 'utf8');
                    const introduction = fs.readFileSync(path.join(coursePath, 'introduction.txt'), 'utf8');
                    const description = fs.readFileSync(path.join(coursePath, 'description.txt'), 'utf8');
                    const learnsDescription = fs.readFileSync(path.join(coursePath, 'learn-description.txt'), 'utf8');
                    const requirementsDescription = fs.readFileSync(path.join(coursePath, 'requirement-description.txt'), 'utf8');
                    const price = parseFloat(fs.readFileSync(path.join(coursePath, 'price.txt'), 'utf8'));
                    let discount = fs.readFileSync(path.join(coursePath, 'discount.txt'), 'utf8');
                    let discountNumber = parseInt(discount.replace(/\D/g, ''), 10);
                    let duration = fs.readFileSync(path.join(coursePath, 'duration.txt'), 'utf8');
                    const durationInSeconds = this.getDurationInSeconds(duration);
                    const totalLesson = this.getLectureCount(fs.readFileSync(path.join(coursePath, 'duration.txt'), 'utf8'));
                    const averageRating = parseFloat(fs.readFileSync(path.join(coursePath, 'average-rating.txt'), 'utf8'));
                    let totalStudent = fs.readFileSync(path.join(coursePath, 'total-student.txt'), 'utf8');
                    const totalStudentNumber = parseInt(totalStudent.replace(/\D/g, ''), 10);
                    const levelId = this.getRandomLevelId() ; // Random 1 -> 4
                    // Create course
                    const newCourse = await this.courseRepository.create({
                        title: title,
                        introduction: introduction,
                        description: description,
                        learnsDescription: learnsDescription,
                        requirementsDescription: requirementsDescription,
                        price: price,
                        discount: discountNumber,
                        categoryId: newCategory.id,
                        languageId: 1,
                        levelId: levelId,
                        instructorId: instructorId,
                        courseId : this.generateCourseId(title),
                        duration : durationInSeconds,
                        totalStudents: totalStudentNumber,
                        averageRating: averageRating,
                        totalLessons: totalLesson
                    });

                    // Create posterURL and update course
                    const posterUrl = `courses/${newCourse.id}/poster.jpg`;
                    newCourse.posterUrl = posterUrl;
                    await this.courseRepository.updateInstance(newCourse);
                    // Put poster to S3
                    const posterPath = path.join(coursePath, 'poster-url.jpg');
                    // await this.putImageToS3(posterUrl, posterPath);

                    // =========START CREATE TOPIC FOR COURSE =============
                    const topicPath = path.join(coursePath, 'topics');
                    // Lặp qua các topic trong từng khoá học
                    fs.readdirSync(topicPath).forEach(async topic => {
                        let topicName = fs.readFileSync(path.join(topicPath, topic, 'topicName.txt'), 'utf8');
                        // Create topic
                        const newTopic = await this.topicRepository.create({
                            courseId: newCourse.id,
                            name: topicName
                        });
                        // Create lesson for topic
                        const lessons = fs.readFileSync(path.join(topicPath, topic, 'lessons.txt'), 'utf8'); // Get lessons
                        const lines = lessons.split('\n');
                        const lessonsArray = lines.map(string => {
                            const match = string.match(/(.*?)\d{2}:\d{2}$/);
                            return match ? match[1].trim() : string;
                        });
                        const lessonsDurationArray = lines.map(string => this.getTimeInSeconds(string));
                        const dataLessons: any[] = [];
                        lessonsArray.forEach((line, index) => {
                            const lesson = line;
                            const lessonDuration = lessonsDurationArray[index];
                            dataLessons.push({
                                title: lesson,
                                duration: lessonDuration,
                                isPreview: false,
                                topicId: newTopic
                            });
                        });

                        await this.lessonRepository.createLessons(dataLessons);
    
                    });
                    // =========END CREATE TOPIC FOR COURSE =============
                }
            });
        });
    }
}
