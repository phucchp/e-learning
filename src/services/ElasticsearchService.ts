import { Inject, Service } from 'typedi';
import { ParsedQs } from 'qs';
import { BadRequestError, ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import * as path from 'path';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { S3Service } from './S3Service';
import { Course } from '../models/Course';

@Service()
export class ElasticsearchService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    private static elasticClient: Client;
    private ES_NODE: string;
    private ELASTIC_USERNAME: string;
    private ELASTIC_PASSWORD: string;

    private VIDEO_DURATION_EXTRA_SHORT = 1;
    private VIDEO_DURATION_SHORT = 3;
    private VIDEO_DURATION_MEDIUM = 6;
    private VIDEO_DURATION_LONG = 17;

    constructor() {
        const projectRoot = path.resolve(__dirname, '../../');
        // Kết hợp đường dẫn gốc với đường dẫn tương đối của tệp chứng chỉ
        const caCertFullPath = path.join(projectRoot, 'ca.crt');

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
                await this.addCourses();
                console.log('Add course done');
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

    public async searchCourses(
            querySearch: string,
            languages?: string[],
            levels?: string[],
            price?: string[],
            durations?: string[],
            page: number = 1,
            pageSize: number = 10,
            sortField: string = 'averageRating',
            sortOrder: string ='desc',
            averageRating?: number,
        ) {
            
        const from = (page - 1) * pageSize;
        const size = pageSize;
        const query: any = {
            bool: {
                must: [
                    
                ]
            }
        };
        const post_filter: any = {
            bool: {
                filter:[

                ]
            }
        };
        // Init query
        if (querySearch && querySearch != '') {
            // query.bool.must.push({
            //     match: {
            //         title: {
            //             query: querySearch,
            //             operator: "AND"
            //         }
            //     }
            // });
            query.bool.must.push({
                multi_match: {
                  query: querySearch,
                  fields: ["title", "introduction"]
                }
            });
        } else {
            query.bool.must.push({
                match_all: {}
            });
        }

        if (languages && languages.length > 0) {
            post_filter.bool.filter.push({
                nested: {
                    path: "language",
                    query: {
                        terms: {
                            "language.id": languages
                        }
                    }
                }
            });
        }

        if (levels && levels.length > 0) {
            post_filter.bool.filter.push({
                nested: {
                    path: "level",
                    query: {
                        terms: {
                            "level.name.keyword": levels
                        }
                    }
                }
            });
        }

        if (durations && durations.length > 0) {
            const should = [];
            for(const duration of durations) {
                if (duration == 'extraShort') { // 0<= duration <= 1
                    should.push({
                        "range": {
                          "duration": {
                            "gte": 0,
                            "lte": this.VIDEO_DURATION_EXTRA_SHORT
                          }
                        }
                    });
                }
                if (duration == 'short') {
                    should.push({
                        "range": {
                          "duration": {
                            "gt": this.VIDEO_DURATION_EXTRA_SHORT,
                            "lte": this.VIDEO_DURATION_SHORT
                          }
                        }
                    });
                }
                if (duration == 'medium') {
                    should.push({
                        "range": {
                          "duration": {
                            "gt": this.VIDEO_DURATION_SHORT,
                            "lte": this.VIDEO_DURATION_MEDIUM
                          }
                        }
                    });
                }
                if (duration == 'long') {
                    should.push({
                        "range": {
                          "duration": {
                            "gt": this.VIDEO_DURATION_MEDIUM,
                            "lte": this.VIDEO_DURATION_LONG
                          }
                        }
                    });
                }
                if (duration == 'extraLong') {
                    should.push({
                        "range": {
                          "duration": {
                            "gt": this.VIDEO_DURATION_LONG,
                          }
                        }
                    });
                }
            }
            post_filter.bool.filter.push({
                bool : {
                    should: should
                }
            });
        }

        if (price && price.length > 0) { // Validate price is 'Paid' or 'Free'
            if (price.length === 1 && price[0] === "paid") {
                post_filter.bool.filter.push({
                    range: {
                        price: {
                            gte: 0.001,
                        }
                    }
                });
            } else if (price.length === 1 && price[0] === "free") {
                post_filter.bool.filter.push({
                    range: {
                        price: {
                            lte: 0.001
                        }
                    }
                });
            }
        }

        if(averageRating) {
            post_filter.bool.filter.push({
                range: {
                    averageRating: {
                        gte: averageRating
                    }
                }
            });
        }


        const body = {
            index: 'courses',
            query: query,
            post_filter: post_filter,
            sort: [
                {
                    [sortField]: {
                        order: sortOrder
                    }
                }
            ],
            from,
            size,
            highlight: {
                pre_tags: ["<strong>"],
                post_tags: ["</strong>"],
                fields: {
                  title: {},
                  introduction: {}
                }
            },
            aggs: {
                language: {
                    nested: {
                        path: "language"
                    },
                    aggs: {
                        language_id: {
                            terms: {
                                field: "language.name.keyword"
                            }
                        }
                    }
                },
                level: {
                    nested: {
                        path: "level"
                    },
                    aggs: {
                        level_id: {
                            terms: {
                                field: "level.name.keyword"
                            }
                        }
                    }
                },
                price_ranges: {
                    range: {
                        field: "price",
                        ranges: [
                            { key: "Free", from: 0, to: 0.001 },
                            { key: "Paid", from: 0.001 }
                        ]
                    }
                },
                video_duration_ranges: {
                    range: {
                        field: "duration",
                        ranges: [
                            { "key": "extraShort", "from": 0, "to": 1.01 },
                            { "key": "short", "from": 1.01, "to": 3.01 },
                            { "key": "medium", "from": 3.01, "to": 6.01 },
                            { "key": "long", "from": 6.01, "to": 17.01 },
                            { "key": "extraLong", "from": 17.01 }
                        ]
                    }
                },
                average_rating_ranges: {
                    range: {
                        field: "averageRating",
                        ranges: [
                            { key: "4.5 & up", from: 4.5 },
                            { key: "4.0 & up", from: 4.0 },
                            { key: "3.5 & up", from: 3.5 },
                            { key: "3.0 & up", from: 3.0 },
                            { key: "2.5 & up", from: 2.5 }
                        ]
                    }
                }
            }
        };
        // return body;
        try {
            const response = await ElasticsearchService.elasticClient.search(body);
            const courses = response.hits.hits;
            for(const course of courses) {
                const source = course._source as { posterUrl: string }; // Adjust the type as needed
                source.posterUrl = await this.s3Service.getObjectUrl(source.posterUrl);
            }
            return response;
        } catch (error) {
            console.error('Elasticsearch search error:', error);
            throw new Error('Error performing search');
        }
    }

    async createIndex() {
        try {
          const indexName = 'courses';
      
          // Kiểm tra nếu index đã tồn tại
          const indexExists = await ElasticsearchService.elasticClient.indices.exists({ index: indexName });
          if (indexExists) {
            console.log(`Index ${indexName} đã tồn tại.`);
            return;
          }
      
          // Tạo index mới với mapping
          await ElasticsearchService.elasticClient.indices.create({
            index: indexName,
            body: {
              mappings: {
                properties: {
                  courseId: { type: 'text' },
                  title: { type: 'text' },
                  introduction: { type: 'text' },
                  description: { type: 'text' },
                  learnsDescription: { type: 'text' },
                  requirementsDescription: { type: 'text' },
                  price: { type: 'float' },
                  discount: { type: 'integer' },
                  duration: { type: 'integer' },
                  category: {
                    type: 'nested',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'text' }
                    }
                  },
                  instructor: {
                    type: 'nested',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'text' }
                    }
                  },
                  averageRating: { type: 'float' },
                  trailerUrl: { type: 'text' },
                  subUrl: { type: 'text' },
                  posterUrl: { type: 'text' },
                  totalStudents: { type: 'integer' },
                  totalLessons: { type: 'integer' },
                  language: {
                    type: 'nested',
                    properties: {
                      id: { type: 'integer' },
                      languageName: { type: 'text' }
                    }
                  },
                  level: {
                    type: 'nested',
                    properties: {
                      id: { type: 'integer' },
                      levelName: { type: 'text' }
                    }
                  },
                  isActive: { type: 'boolean' },
                  createdAt: { type: 'date' },
                  updatedAt: { type: 'date' }
                }
              }
            }
          });
      
          console.log(`Index ${indexName} đã được tạo thành công.`);
        } catch (error) {
            throw new ServerError('error');
          console.error('Lỗi khi tạo index:', error);
        }
    }

    public async addCourses() {
        await this.createIndex();
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

    async addCourse(course: Course) {
        const courseData = {
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
              id: 1,
              name: "Databases"
            },
            instructor: {
              id: 1,
              name: "John Doe"
            },
            averageRating: 4.5,
            trailerUrl: "http://example.com/trailer",
            subUrl: "http://example.com/sub",
            posterUrl: "http://example.com/poster",
            totalStudents: 100,
            totalLessons: 10,
            language: {
              id: 1,
              languageName: "English"
            },
            level: {
              id: 1,
              levelName: "Beginner"
            },
            isActive: true,
            createdAt: "2024-06-11T00:00:00Z",
            updatedAt: "2024-06-11T00:00:00Z"
          };
          try {
            const indexName = 'courses';
        
            // Chèn dữ liệu
            const response = await ElasticsearchService.elasticClient.index({
              index: indexName,
              document: courseData
            });
        
            console.log('Dữ liệu đã được chèn thành công:', response);
          } catch (error) {
            console.error('Lỗi khi chèn dữ liệu:', error);
          }
    }
}