import { NoteController } from "../controllers/NoteController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class NoteRoutes extends BaseRoutes {
	constructor() {
		super(new NoteController());
	}
	public routes(): void {
		this.router.get('/',auth, this.controller.getNotes);
		this.router.post('/',auth, this.controller.createNote);
		this.router.delete('/:noteId',auth, this.controller.deleteNote);
		this.router.put('/:noteId',auth, this.controller.updateNote);
	}
}

export default new NoteRoutes().router;
