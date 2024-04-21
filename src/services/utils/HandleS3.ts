import { Service, Inject } from "typedi";
import { S3Service } from "../S3Service";
import { ICartService } from "../interfaces/ICartService";
import { Course } from "../../models/Course";


@Service()
export class HandleS3 {
    @Inject(() => S3Service)
	private s3Service!: S3Service;

    /**
	 * Using get resource S3 for courses
	 * @param courses 
	 * @returns array
	 */
	async getResourceCourses(courses: Course[]): Promise<Course[]> {
        for(let course of courses) {
            course = await this.getResourceCourse(course);
        }

		return courses;
	}

    /**
	 * Using get resource S3 for courses
	 * @param course
	 * @returns course
	 */
	async getResourceCourse(course: Course): Promise<Course> {
        let trailerUrl = course.getDataValue('trailerUrl') || 'courses/defaults/trailer.mp4';
        let posterUrl = course.getDataValue('posterUrl') || 'courses/defaults/poster.jpg';

        course.setDataValue('trailerUrl', await this.s3Service.getObjectUrl(trailerUrl));
        course.setDataValue('posterUrl', await this.s3Service.getObjectUrl(posterUrl));

		return course;
	}
}