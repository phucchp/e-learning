import { ChatController } from "../controllers/ChatController";
import { auth } from "../middlewares/AuthMiddleware";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class PineconeRoutes extends BaseRoutes {
	constructor() {
		super(new ChatController());
	}
	public routes(): void {
		this.router.post('/',this.controller.chat);
	}
}

export default new PineconeRoutes().router;
