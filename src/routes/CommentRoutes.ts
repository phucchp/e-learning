import { CommentController } from "../controllers/CommentController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validateCreateComment, validateDeleteComment, validateUpdateComment } from "../validators/CommentValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class CommentRoutes extends BaseRoutes {
	constructor() {
		super(new CommentController());
	}
	public routes(): void {
		this.router.post('/',auth, validateCreateComment, validate, this.controller.createComment);
		this.router.delete('/:commentId',auth,validateDeleteComment, validate, this.controller.deleteComment);
		this.router.put('/:commentId',auth, validateUpdateComment, validate, this.controller.updateComment);
	}
}

export default new CommentRoutes().router;
