import { PineconeController } from "../controllers/PineconeController";
import { auth } from "../middlewares/AuthMiddleware";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class PineconeRoutes extends BaseRoutes {
	constructor() {
		super(new PineconeController());
	}
	public routes(): void {
		this.router.get('/',this.controller.pushDataToPinecone);
		this.router.get('/deleteNamespace',this.controller.deleteNamespace);
		this.router.post('/courses/add-data-for-chatbot',this.controller.createDataChat);
	}
}

export default new PineconeRoutes().router;
