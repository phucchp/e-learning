import { EWalletController } from "../controllers/EWalletController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validateCreateEWallet, validateUpdateEWallet } from "../validators/EWalletValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class EWalletRoutes extends BaseRoutes {
	constructor() {
		super(new EWalletController());
	}
	public routes(): void {
		this.router.get('/paypal',auth, this.controller.getEWallet);
		this.router.post('/paypal',auth, validateCreateEWallet, this.controller.createEWallet);
		this.router.put('/paypal',auth, validateUpdateEWallet, this.controller.updateEWallet);
	}
}

export default new EWalletRoutes().router;
