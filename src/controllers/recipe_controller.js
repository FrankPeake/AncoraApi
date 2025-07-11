export const RecipeController = {
    async getAllRecipes(req, res) {
        try {
            const recipes = await recipeService.getAllRecipes()
            res.status(200).json(recipes)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch recipes' })
        }
    },
    async getRecipeById(req, res) {
        const { id } = req.params
        try {
            const recipe = await recipeService.getRecipeById(id)
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' })
            }
            res.status(200).json(recipe)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch recipe' })
        }
    },
    async createRecipe(req, res) {
        const recipeData = req.body
        try {
            const newRecipe = await recipeService.createRecipe(recipeData)
            res.status(201).json(newRecipe)
        } catch (error) {
            res.status(500).send({ error: 'Failed to create recipe' })
        }
    },
    async updateRecipe(req, res) {
        const { id } = req.params
        const recipeData = req.body
        try {
            const updatedRecipe = await recipeService.updateRecipe(id, recipeData)
            res.status(200).json(updatedRecipe)
        } catch (error) {
            res.status(500).send({ error: 'Failed to update recipe' })
        }
    },
    async deleteRecipe(req, res) {
        const { id } = req.params
        try {
            const recipe = await recipeService.deleteRecipe(id)
            res.status(204).send(recipe) // No content
        } catch (error) {
            res.status(500).send({ error: 'Failed to delete recipe' })
        }
    }
}
import { recipeService } from '../services/recipe_service.js'
// This controller handles HTTP requests related to recipes
// It uses the recipeService to perform business logic and interact with the database
// The controller methods correspond to the routes defined in recipe_routes.js
// Each method handles a specific HTTP request and returns a response