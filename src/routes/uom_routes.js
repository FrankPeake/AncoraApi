import {Router} from 'express';
import { RecipeController } from '../controllers/recipe_controller.js';
const router = Router()

//pull possible uom from the database
router.get('/', RecipeController.getUOM)

export default router