import { NoteController } from "../controllers/NoteController";
import { auth, authUser } from "../middlewares/AuthMiddleware";
import { validateCreateNote, validateDeleteNote, validateGetNotes, validateUpdateNote } from "../validators/NoteValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class NoteRoutes extends BaseRoutes {
	constructor() {
		super(new NoteController());
	}
	public routes(): void {
		this.router.get('/',auth,validateGetNotes, validate, this.controller.getNotes);
		this.router.post('/',auth, validateCreateNote, validate, this.controller.createNote);
		this.router.delete('/:noteId',auth,validateDeleteNote, validate, this.controller.deleteNote);
		this.router.put('/:noteId',auth, validateUpdateNote, validate, this.controller.updateNote);
	}
}

export default new NoteRoutes().router;
