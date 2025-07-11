import { RecipeModel } from '../models/recipe_model.js';``
export const recipeService = {
    async getAllRecipes() {
        return RecipeModel.getAllRecipes()
    },
    async getRecipeById(id) {
        const recipe = await RecipeModel.getRecipeById(id)
        if (!recipe) {
            throw new Error(`Recipe with ID ${id} not found`)
        }  
        return recipe
    },
    async createRecipe(recipeData) {    
        const sanitizedRecipeData = {
            ...recipeData,
            title: recipeData.title.trim(),
            servings: recipeData.servings.trim(),
            prep_time: recipeData.prep_time.trim(),
            cook_time: recipeData.cook_time.trim(),
            description: recipeData.description.trim(),
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
        }
        console.log(sanitizedRecipeData)
        const createdRecipe = await RecipeModel.createRecipe(sanitizedRecipeData)
        if (!createdRecipe) {
            throw new Error('Failed to create recipe')
        }
        return createdRecipe        
    },
    async updateRecipe(id, recipeData) {    
        const sanitizedRecipeData = {
            ...recipeData,
            title: recipeData.title.trim(),
            servings: recipeData.servings.trim(),
            prep_time: recipeData.prep_time.trim(),
            cook_time: recipeData.cook_time.trim(),
            description: recipeData.description.trim(),
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
        }
        return await RecipeModel.updateRecipe(id, sanitizedRecipeData);
    },
    async deleteRecipe(id) {    
        const deletedId = await RecipeModel.deleteRecipe(id)
        return `Deleted recipe with ID: ${deletedId}`
    }
}
// This service can be used in the RecipeController to handle business logic