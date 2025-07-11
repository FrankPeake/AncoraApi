import {Router} from 'express';
import { RecipeController } from '../controllers/recipe_controller.js';

const router = Router()

router.get('/', RecipeController.getAllRecipes)
router.get('/:id', RecipeController.getRecipeById)
router.post('/', RecipeController.createRecipe)
router.put('/:id', RecipeController.updateRecipe)
router.delete('/:id', RecipeController.deleteRecipe)

export default router