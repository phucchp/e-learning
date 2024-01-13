import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import Database from './config/database';
import CategoryRoutes from './routes/CategoryRoutes';
import cors from 'cors';

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.databaseSync();
		this.routes();
		this.plugins();
	}

	private databaseSync(): void {
		const movieRepository = Database.getInstance();
		movieRepository
			.sequelize!.sync({ force: false })
			.then(() => {
				// console.log('✅ Cơ sở dữ liệu đã được đồng bộ hóa.');
			})
			.catch((error) => {
				console.error('❌ Lỗi đồng bộ hóa cơ sở dữ liệu:', error);
			});
	}

	private routes(): void {
		this.app.route('/').get((req: Request, res: Response) => {
			res.send('<h1> Hello world!!! </h1>');
		});
		this.app.use('/api/categories', CategoryRoutes);

		// Middleware cuối cùng để xử lý khi không có route nào khớp
		this.app.use((req, res) => {
            const url = req.url;
			res.status(404).json({
                message: `API ${url} not found!`
            });
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
