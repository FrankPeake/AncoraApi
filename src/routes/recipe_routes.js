import {Router} from 'express';
import { RecipeController } from '../controllers/recipe_controller.js';
import { validateData } from '../middlewares/validation_middleware.js';
import { createRecipeSchema } from '../schemas/recipe_schema.js';
const router = Router()

router.get('/', RecipeController.getAllRecipes)
router.get('/:id', RecipeController.getRecipeById)
router.post('/', validateData(createRecipeSchema), RecipeController.createRecipe)
router.put('/:id', RecipeController.updateRecipe)
router.delete('/:id', RecipeController.deleteRecipe)

export default router