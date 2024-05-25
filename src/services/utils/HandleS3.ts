import { Service, Inject } from "typedi";
import { S3Service } from "../S3Service";
import { ICartService } from "../interfaces/ICartService";
import { Course } from "../../models/Course";
import { Profile } from "../../models/Profile";


@Service()
export class HandleS3 {
    @Inject(() => S3Service)
	private s3Service!: S3Service;

    /**
	 * Using get resource S3 for courses
     * When get list course, only return poster
	 * @param courses 
	 * @returns array
	 */
	async getResourceCourses(courses: Course[]): Promise<Course[]> {
        for(const course of courses) {
            let posterUrl = course.getDataValue('posterUrl') || 'courses/defaults/poster.jpg';
			if ('trailerUrl' in course) {
				let trailerUrl = course.getDataValue('trailerUrl') || 'courses/defaults/trailer.mp4';
				course.setDataValue('trailerUrl', await this.s3Service.getObjectUrl(trailerUrl));
			}
			
            course.setDataValue('posterUrl', await this.s3Service.getObjectUrl(posterUrl));

			if (course.getDataValue('instructor')) {
				const profile = course.getDataValue('instructor').getDataValue('profile');
				if (profile) {
					course.instructor.setDataValue('profile', await this.getAvatarUser(profile));
				}
			}
			
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

	/**
	 * Get avatar url of user from S3 service
	 * @param profileUser 
	 * @returns 
	 */
	async getAvatarUser(profileUser: Profile): Promise<Profile> {
		if ('avatar' in profileUser) {
			const avatar = profileUser.getDataValue('avatar') || 'users/defaults/avatar.jpg';
			profileUser.setDataValue('avatar', await this.s3Service.getObjectUrl(avatar));
		}

		return profileUser;
	}
}
