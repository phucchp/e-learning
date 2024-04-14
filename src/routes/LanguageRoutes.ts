import { LanguageController } from "../controllers/LanguageController";
import { validateCreateLanguage, validateDeleteLanguage, validateGetLanguage, validateUpdateLanguage } from "../validators/LanguageValidator";
import { validate } from "../validators/Validate";
import BaseRoutes from "./base/BaseRouter";


class LanguageRoutes extends BaseRoutes {
	constructor() {
		super(new LanguageController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getLanguages);
        this.router.get('/:languageId',validateGetLanguage, validate, this.controller.getLanguage);
        this.router.post('/',validateCreateLanguage, validate, this.controller.createLanguage);
        this.router.delete('/:languageId',validateDeleteLanguage, validate, this.controller.deleteLanguage);
        this.router.put('/:languageId',validateUpdateLanguage, validate, this.controller.updateLanguage);
	}
}

export default new LanguageRoutes().router;
