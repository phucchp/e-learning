import { ReviewController } from "../controllers/ReviewController";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class ReviewRoutes extends BaseRoutes {
	constructor() {
		super(new ReviewController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getReviews);
	}
}

export default new ReviewRoutes().router;
