import { PaymentController } from "../controllers/PaymentController";
import { auth } from "../middlewares/AuthMiddleware";
import { validateCaptureOrder, validateCreatePayment, validateGetInstructorPayment } from "../validators/PaymentValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class PaymentRoutes extends BaseRoutes {
	constructor() {
		super(new PaymentController());
	}
	public routes(): void {
		this.router.post('/create-order',auth,validateCreatePayment, validate, this.controller.createOrder);
		this.router.post('/orders/:orderID/capture',validateCaptureOrder, validate, this.controller.captureOrder);
		this.router.post('/cancel-order',auth, this.controller.cancelOrder);
		this.router.get('/instructor-payments', validateGetInstructorPayment, validate, this.controller.getInstructorPayment);
	}
}

export default new PaymentRoutes().router;
