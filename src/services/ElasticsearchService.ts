import { Inject, Service } from 'typedi';
import { ParsedQs } from 'qs';
import { BadRequestError, ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import * as path from 'path';

@Service()
export class ElasticsearchService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    private static elasticClient: Client;
    private ES_NODE: string;
    private ELASTIC_USERNAME: string;
    private ELASTIC_PASSWORD: string;

    constructor() {
        const projectRoot = path.resolve(__dirname, '../../');
        // Kết hợp đường dẫn gốc với đường dẫn tương đối của tệp chứng chỉ
        const caCertFullPath = path.join(projectRoot, 'ca.crt');
        console.log(caCertFullPath);

        this.ES_NODE = process.env.ES_NODE || 'https://es01:9200';
        this.ELASTIC_USERNAME = process.env.ELASTIC_USERNAME || 'elastic';
        this.ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD || 'elearning';

        if(!process.env.ES_NODE) {
            console.log(`⚠️ Warning!: Missing ES_NODE environment variable, default: 'https://es01:9200'`)
        }

        if(!process.env.ELASTIC_USERNAME) {
            console.log(`⚠️ Warning!: Missing ELASTIC_USERNAME environment variable, default: 'elastic'`)
        }

        if(!process.env.ELASTIC_PASSWORD) {
            console.log(`⚠️ Warning!: Missing ELASTIC_PASSWORD environment variable, default: 'elearning'`)
        }

        ElasticsearchService.elasticClient = new Client({
            node: this.ES_NODE,
            auth: {
                username: this.ELASTIC_USERNAME,
                password: this.ELASTIC_PASSWORD,  
            },
            tls: {
                ca: fs.readFileSync(caCertFullPath),
                rejectUnauthorized: false // Để kiểm tra, sau đó nên bật lại để bảo mật
            }
        });
    }

    public async checkConnection(): Promise<void> {
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            try {
                const health = await ElasticsearchService.elasticClient.cluster.health();
                console.log('Elasticsearch cluster health:', health);
                return;
            } catch (error: any) {
                attempts++;
                console.error(`Attempt ${attempts} failed: ${error.message}`);
                if (attempts < maxAttempts) {
                    await new Promise(res => setTimeout(res, 2000)); // Đợi 2 giây trước khi thử lại
                }
            }
        }
        console.error('All connection attempts failed.');
    }

    public async searchCourses(query: string, page: number = 1, size: number = 10) {
        try {
            const response = await ElasticsearchService.elasticClient.search({
                index: 'courses_v1',
                body: {
                    from: (page - 1) * size,
                    size: size,
                    query: {
                        multi_match: {
                            query: query,
                            fields: ['title']
                        }
                    }
                }
            });
            return response;
            console.log(response);
            const { hits } = response.hits;
            return {
                courses: hits.map((hit: any) => hit._source)
            };
        } catch (error) {
            console.error('Elasticsearch search error:', error);
            throw new Error('Error searching for courses');
        }
    }

    public async addCourses() {
        for(let page=1; page <18; page++) {
            const options = {
                page:  page,
                pageSize:  100,
                sortType: 'ASC',
                sort :'id'
            }
            const data = await this.courseRepository.getCourses(options);
            const courses = data.rows;
            if(courses.length <=0) {
                console.log(`Done`);
                break;
            }
            const bulkBody = courses.flatMap(course => [
                { index: { _index: 'courses', _id: course.id } },
                {
                    courseId: course.courseId,
                    title: course.title,
                    introduction: course.introduction,
                    description: course.description,
                    learnsDescription: course.learnsDescription,
                    requirementsDescription: course.requirementsDescription,
                    price: course.price,
                    discount: course.discount,
                    duration: course.duration,
                    category: {
                      id: course.category.id,
                      name: course.category.name
                    },
                    instructor: {
                      id: course.instructorId,
                      name: course.instructor.profile.fullName
                    },
                    averageRating: course.averageRating,
                    trailerUrl: course.trailerUrl,
                    subUrl: course.subUrl,
                    posterUrl: course.posterUrl,
                    totalStudents: course.totalStudents,
                    totalLessons: course.totalLessons,
                    language: {
                      id: course.language.id,
                      name: course.language.languageName
                    },
                    level: {
                      id: course.level.id,
                      name: course.level.levelName
                    },
                    isActive: true,
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt
                }
            ]);
            try {
                const response = await ElasticsearchService.elasticClient.bulk({ body: bulkBody });
                if (response.errors) {
                    console.error('Bulk indexing errors:', response.items);
                    throw new Error('Error indexing some courses');
                }

            } catch (error) {
                console.error('Elasticsearch bulk index error:', error);
                throw new Error('Error indexing courses');
            }
            console.log(`Successfully ${page}`);
            // Add a 3-second wait before the next iteration
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}