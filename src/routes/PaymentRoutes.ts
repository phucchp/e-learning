import { PaymentController } from "../controllers/PaymentController";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class PaymentRoutes extends BaseRoutes {
	constructor() {
		super(new PaymentController());
	}
	public routes(): void {
		this.router.post('/create-order', this.controller.createOrder);
		this.router.post('/orders/:orderID/capture', this.controller.captureOrder);
		this.router.get('/test', this.controller.test);
		this.router.get('/test2', this.controller.test2);

	}
}

export default new PaymentRoutes().router;
