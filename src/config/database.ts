import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Category } from '../models/Category';
import { Language } from '../models/Language';
import { Course } from '../models/Course';
import { Level } from '../models/Level';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Topic } from '../models/Topic';
import { Lesson } from '../models/Lesson';
import { Enrollment } from '../models/Enrollment';
import { Favorite } from '../models/Favorite';
import { Cart } from '../models/Cart';
import { Note } from '../models/Note';
import { Review } from '../models/Review';
import { Comment } from '../models/Comment';
import { Processing } from '../models/Processing';
import { Payment } from '../models/Payment';
import { PaymentDetail } from '../models/PaymentDetail';
import { EWallet } from '../models/EWallet';
import { Resource } from '../models/Resource';
import { Subtitle } from '../models/Subtitle';
import { Remind } from '../models/Remind';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';
import { InstructorPayment } from '../models/InstructorPayment';
import { CourseTag } from '../models/CourseTag';
import { Tag } from '../models/Tag';


dotenv.config();

class Database {
	public sequelize: Sequelize | undefined;

	private POSTGRES_DB = process.env.POSTGRES_DB as string;
	private POSTGRES_HOST = process.env.POSTGRES_HOST as string;
	private POSTGRES_PORT = process.env.POSTGRES_PORT as unknown as number;
	private POSTGRES_USER = process.env.POSTGRES_USER as string;
	private POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD as string;
	private POSTGRES_SSL = process.env.POSTGRES_SSL as string;

	private static instance: Database | null = null;

	private constructor() {
		// List of environment variables
        const requiredEnvVariables = [
			'POSTGRES_DB',
			'POSTGRES_HOST',
			'POSTGRES_PORT',
			'POSTGRES_USER',
			'POSTGRES_PASSWORD',
			'POSTGRES_SSL',
		];
		// Loop through the list of environment variables and check if they are set or not
		const missingVariables = requiredEnvVariables.filter(variable => !process.env[variable]);
		if (missingVariables.length > 0) {
			throw new Error(`Missing POSTGRESQL DB environment variables: ${missingVariables.join(', ')}`);
		}
		this.connectToPostgreSQL();
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	private async connectToPostgreSQL() {
		let ssl: boolean;
		if (this.POSTGRES_SSL === 'true') {
			ssl = true;
		} else {
			ssl = false;
		}
		this.sequelize = new Sequelize({
			database: this.POSTGRES_DB,
			username: this.POSTGRES_USER,
			password: this.POSTGRES_PASSWORD,
			host: this.POSTGRES_HOST,
			port: this.POSTGRES_PORT,
			dialect: 'postgres',
			logging: false,
			dialectOptions: {
				ssl: ssl,
			},
		});
		this.sequelize.addModels([
			Category,
			Course,
			Enrollment,
			Favorite,
			Language,
			Level,
			User,
			Profile,
			Topic,
			Lesson,
			Cart,
			Note,
			Review,
			Comment,
			Processing,
			Payment,
			PaymentDetail,
			Subtitle,
			Resource,
			EWallet,
			Remind,
			Question,
			Answer,
			InstructorPayment,
			Tag,
			CourseTag
		]);

		await this.sequelize
			.authenticate()
			.then(() => {
				console.log(
					'✅ PostgreSQL Connection has been established successfully.'
				);
			})
			.catch((err) => {
				console.error('❌ Unable to connect to the PostgreSQL database:', err);
			});
	}
}

export default Database;
