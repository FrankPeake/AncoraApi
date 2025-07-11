import express from 'express';
import recipeRoutes from './routes/recipe_routes.js';
import userRoutes from './routes/user_routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies
app.use('/recipes', recipeRoutes)
app.use('/users', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
