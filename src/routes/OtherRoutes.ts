import { OtherController } from "../controllers/OtherController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class OtherRoutes extends BaseRoutes {
	constructor() {
		super(new OtherController());
	}
	public routes(): void {
		this.router.get('/create-data-course', this.controller.createDataCourse);
		this.router.post('/redis/clearAllCache', this.controller.clearCacheAllCache);
		this.router.post('/redis/clear-cache-recommend', auth, this.controller.clearCacheContentBaseRcm);
		this.router.get('/recommend/matrix-collaborative', this.controller.getMatrixCollaborative);
		this.router.get('/recommend/matrix-content-based', this.controller.getMatrixContentBased);

	}
}

export default new OtherRoutes().router;
