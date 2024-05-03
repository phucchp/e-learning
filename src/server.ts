import 'reflect-metadata';
import "express-async-errors";
import express, { Application, Request, Response, NextFunction } from 'express';
import Database from './config/database';
import CategoryRoutes from './routes/CategoryRoutes';
import cors from 'cors';
import CourseRoutes from './routes/CourseRoutes';
import LanguageRoutes from './routes/LanguageRoutes';
import AuthenticationRoutes from './routes/AuthenticationRoutes';
import ReviewRoutes from './routes/ReviewRoutes';
import NoteRoutes from './routes/NoteRoutes';
import { handleError } from './utils/CustomError';
import UserRoutes from './routes/UserRoutes'
import LessonRoutes from './routes/LessonRoutes';
import StatisticalRoutes from './routes/StatisticalRoutes';
import PaymentRoutes from './routes/PaymentRoutes';
import RemindRoutes from './routes/RemindRoutes';
import CommentRoutes from './routes/CommentRoutes';
import OtherRoutes from './routes/OtherRoutes';
import EWalletRoutes from './routes/EWalletRoutes';
class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.databaseSync();
		this.plugins();
		this.routes();
	}

	private databaseSync(): void {
		const movieRepository = Database.getInstance();
		movieRepository
			.sequelize!.sync({ force: false })
			.then(() => {
				// console.log('✅ Cơ sở dữ liệu đã được đồng bộ hóa.');
			})
			.catch((error) => {
				console.error('❌ Database synchronization error:', error);
			});
	}

	private routes(): void {
		this.app.route('/').get((req: Request, res: Response) => {
			res.send('<h1> Hello world!!! </h1>');
		});
		this.app.use('/api/categories', CategoryRoutes);
		this.app.use('/api/courses', CourseRoutes);
		this.app.use('/api/languages', LanguageRoutes);
		this.app.use('/api/auth', AuthenticationRoutes);
		this.app.use('/api/reviews', ReviewRoutes);
		this.app.use('/api/notes', NoteRoutes);
		this.app.use('/api/users', UserRoutes);
		this.app.use('/api/lessons', LessonRoutes);
		this.app.use('/api/statistical', StatisticalRoutes);
		this.app.use('/api/payments', PaymentRoutes);
		this.app.use('/api/reminds', RemindRoutes);
		this.app.use('/api/comments', CommentRoutes);
		this.app.use('/api/others', OtherRoutes);
		this.app.use('/api/e-wallets', EWalletRoutes);

		// Middleware cuối cùng để xử lý khi không có route nào khớp
		this.app.use((req, res) => {
            const url = req.url;
			res.status(404).json({
                message: `API ${url} not found!`
            });
		});

		// Xử lí error khi gặp ngoại lệ
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction):void => {
			handleError(err, req, res);
		});
	}

	private plugins(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cors()); // Use the cors middleware
	}
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
	console.log(`✅ Server started successfully at Port: ${port}`);
});
