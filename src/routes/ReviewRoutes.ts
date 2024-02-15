import { ReviewController } from "../controllers/ReviewController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validateCreateReview, validateDeleteReview, validateUpdateReview } from "../validators/ReviewValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class ReviewRoutes extends BaseRoutes {
	constructor() {
		super(new ReviewController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getReviews);
		this.router.post('/',auth,validateCreateReview, validate, this.controller.createReview);
		this.router.delete('/:reviewId',auth,validateDeleteReview, validate, this.controller.deleteReview);
		this.router.put('/:reviewId',auth,validateUpdateReview, validate, this.controller.updateReview);
	}
}

export default new ReviewRoutes().router;
