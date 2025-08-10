import express from 'express';
import recipeRoutes from './routes/recipe_routes.js';
import userRoutes from './routes/user_routes.js'
import ingredientRoutes from './routes/ingredient_routes.js';
import uomRoutes from './routes/uom_routes.js';
import followRoutes from './routes/follow_routes.js';
import errorHandler from './middlewares/error_handler_middleware.js';

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies
app.use('/recipes', recipeRoutes)
app.use('/ingredients', ingredientRoutes)
app.use('/users', userRoutes)
app.use('/follow', followRoutes) // Assuming follow routes are under user routes
app.use('/uom', uomRoutes)

app.use(errorHandler) // Error handling middleware

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
