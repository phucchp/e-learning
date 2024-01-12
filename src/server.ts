import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import Database from './config/database';

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.databaseSync();
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

	private plugins(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		// Enable CORS for all routes
		// this.app.use(cors()); // Use the cors middleware here
	}
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
	console.log(`✅ Server started successfully at Port: ${port}`);
});
