import { ReviewController } from "../controllers/ReviewController";
import { authUser } from "../middlewares/AuthMiddleware";
import { validateCreateReview } from "../validators/ReviewValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class ReviewRoutes extends BaseRoutes {
	constructor() {
		super(new ReviewController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getReviews);
		this.router.post('/',authUser,validateCreateReview, validate, this.controller.createReview);
	}
}

export default new ReviewRoutes().router;
