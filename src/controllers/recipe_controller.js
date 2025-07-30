export const RecipeController = {
    async getAllRecipes(req, res, next) {
        try {
            const recipes = await recipeService.getAllRecipes()
            res.status(200).json(recipes)
        } catch (error) {
            next(error) 
        }
    },
    async getRecipeById(req, res, next) {
        const { id } = req.params
        try {
            const recipe = await recipeService.getRecipeById(id)
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' })
            }
            res.status(200).json(recipe)
        } catch (error) {
            next(error) 
        }
    },
    async getIngredients(req, res, next) {
        try {
            const ingredients = await recipeService.getIngredients()
            res.status(200).json(ingredients)
        } catch (error) {
            next(error) 
        }   
    },
    async getUOM(req, res, next) {  
        try {
            const uom = await recipeService.getUOM()
            res.status(200).json(uom)
        } catch (error) {
            next(error) 
        }
    },
    async createRecipe(req, res, next) {
        const recipeData = req.body
        try {
            const newRecipe = await recipeService.createRecipe(recipeData)
            res.status(201).json(newRecipe)
        } catch (error) {
            next(error) 
        }
    },
    async updateRecipe(req, res, next) {
        const { id } = req.params
        const recipeData = req.body
        try {
            const updatedRecipe = await recipeService.updateRecipe(id, recipeData)
            res.status(200).json(updatedRecipe)
        } catch (error) {
            next(error) 
        }
    },
    async deleteRecipe(req, res, next) {
        const { id } = req.params
        try {
            const recipe = await recipeService.deleteRecipe(id)
            res.status(204).send(recipe) // No content
        } catch (error) {
            next(error) 
        }
    }
}
import { recipeService } from '../services/recipe_service.js'
// This controller handles HTTP requests related to recipes
// It uses the recipeService to perform business logic and interact with the database
// The controller methods correspond to the routes defined in recipe_routes.js
// Each method handles a specific HTTP request and returns a response