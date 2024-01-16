import { Inject, Service } from 'typedi';
import { ICourseService } from './interfaces/ICourseService';
import { Course } from '../models/Course';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError, handleErrorFunction } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';

@Service()
export class CourseService implements ICourseService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    async getCourses(): Promise<Course[]> {
       try{
            const courses = await this.courseRepository.getCourses();
            return courses;
       }catch(error){
            throw(error);
       }
    }

}