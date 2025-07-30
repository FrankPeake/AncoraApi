import ERROR_MESSAGES from '../constants/error_messages.js';
import { RecipeModel } from '../models/recipe_model.js';``
import CustomError from '../utils/custom_error.js';
export const recipeService = {
    async getAllRecipes() {
        return RecipeModel.getAllRecipes()
    },
    async getRecipeById(id) {
        const recipe = await RecipeModel.getRecipeById(id)
        if (!recipe) {
            throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404)
        }  
        return recipe
    },
    async getIngredients() {
        const ingredients = await RecipeModel.getIngredients()
        if (!ingredients) {
            throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404)
        }
        const ingredientArray = ingredients.map(ingredient => ingredient.name)
        return ingredientArray
    },
    async getUOM() {
        const uom = await RecipeModel.getUOM()
        if (!uom) {
            throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404)
        }
        const uomArray = uom.map(unit => unit.name)
        return uomArray
    },
    async createRecipe(recipeData) {    
        const sanitizedRecipeData = {
            ...recipeData,
            title: recipeData.title.trim(),
            servings: recipeData.servings,
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time,
            description: recipeData.description.trim(),
        }
        console.log(sanitizedRecipeData)
        const createdRecipe = await RecipeModel.createRecipe(sanitizedRecipeData)
        if (!createdRecipe) {
            throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404)
        }
        return createdRecipe        
    },
    async updateRecipe(id, recipeData) {    
        const sanitizedRecipeData = {
            ...recipeData,
            title: recipeData.title.trim(),
            servings: recipeData.servings,
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time,
            description: recipeData.description.trim(),
        }
        return await RecipeModel.updateRecipe(id, sanitizedRecipeData);
    },
    async deleteRecipe(id) {    
        const deletedId = await RecipeModel.deleteRecipe(id)
        return `Deleted recipe with ID: ${deletedId}`
    }
}
// This service can be used in the RecipeController to handle business logic