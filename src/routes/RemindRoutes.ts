import { RemindController } from "../controllers/RemindController";
import { auth } from "../middlewares/AuthMiddleware";
import { validateAddRemind, validateUpdateRemind, validateDeleteRemind } from "../validators/RemindValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class RemindRoutes extends BaseRoutes {
	constructor() {
		super(new RemindController());
	}
	public routes(): void {
        /** 
         * API Remind for user
         */
		this.router.post('/',auth, validateAddRemind, validate, this.controller.addRemind);
		this.router.put('/',auth, validateUpdateRemind, validate, this.controller.updateRemind);
		this.router.delete('/',auth, validateDeleteRemind, validate, this.controller.deleteRemind);
	}
}

export default new RemindRoutes().router;
