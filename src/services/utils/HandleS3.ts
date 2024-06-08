import { Service, Inject } from "typedi";
import { S3Service } from "../S3Service";
import { ICartService } from "../interfaces/ICartService";
import { Course } from "../../models/Course";
import { Profile } from "../../models/Profile";
import { RedisService } from "../RedisService";


@Service()
export class HandleS3 {
    @Inject(() => S3Service)
	private s3Service!: S3Service;

	@Inject(() => RedisService)
	private redisService!: RedisService;

    /**
	 * Using get resource S3 for courses
     * When get list course, only return poster
	 * @param courses 
	 * @returns array
	 */
	async getResourceCourses(courses: Course[]): Promise<Course[]> {

        for(const course of courses) {
            let posterUrl = course.getDataValue('posterUrl') || 'courses/defaults/poster.jpg';
			// if ('trailerUrl' in course) {
			// 	let trailerUrl = course.getDataValue('trailerUrl') || 'courses/defaults/trailer.mp4';
			// 	course.setDataValue('trailerUrl', await this.s3Service.getObjectUrl(trailerUrl));
			// }
			const cachedResult = await this.redisService.getCache(posterUrl);
			if (cachedResult) {
				// If cached data is available, return it
				course.setDataValue('posterUrl', cachedResult);
			} else {
				const urlPoster =  await this.s3Service.getObjectUrl(posterUrl);
				course.setDataValue('posterUrl',urlPoster);
				await this.redisService.setCache(posterUrl, urlPoster, 10*60);
			}

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
		const trailerUrlCached = await this.redisService.getCache(trailerUrl);
		if (trailerUrlCached) {
			// If cached data is available, return it
			course.setDataValue('trailerUrl', trailerUrlCached);
		} else {
			const urlTrailer = await this.s3Service.getObjectUrl(trailerUrl);
			course.setDataValue('trailerUrl', urlTrailer);
			await this.redisService.setCache(trailerUrl, urlTrailer, 10*60);
		}

		const posterUrlCached = await this.redisService.getCache(trailerUrl);
		if (posterUrlCached) {
			// If cached data is available, return it
			course.setDataValue('posterUrl', posterUrlCached);
		} else {
			const urlPoster = await this.s3Service.getObjectUrl(posterUrl);
			course.setDataValue('posterUrl', urlPoster);
			await this.redisService.setCache(posterUrl, urlPoster, 10*60);
		}

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
			const cachedResult = await this.redisService.getCache(avatar);
			if (cachedResult) {
				// If cached data is available, return it
				profileUser.setDataValue('avatar', cachedResult);
			} else {
				const urlAvt = await this.s3Service.getObjectUrl(avatar);
				profileUser.setDataValue('avatar', urlAvt);
				await this.redisService.setCache(avatar, urlAvt, 10*60);
			}
		}

		return profileUser;
	}
}
