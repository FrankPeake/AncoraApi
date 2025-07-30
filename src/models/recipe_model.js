import db from '../config/db.js';

export const RecipeModel = {
    async getAllRecipes() {
        const query = `SELECT
            r.id,
            r.title,
            r.servings,
            r.prep_time,
            r.cook_time,
            r.description,
            r.user_id,
            r.created_at,
            r.updated_at
        FROM
            recipes r;`
        const response = await db.query(query)
        return response.rows
    },
    async getRecipeById(id) {
        const query = 
        `SELECT
            r.id,
            r.title,
            r.servings,
            r.prep_time,
            r.cook_time,
            r.description,
            r.user_id,
            r.created_at,
            r.updated_at,
            (
                SELECT COALESCE(json_agg(
                    json_build_object(
                        'name', i.name,
                        'category', i.category,
                        'quantity', ri.quantity,
                        'unit', u.name,
                        'notes', ri.notes
                    )
                ), '[]'::json) -- Return an empty array '[]' if no ingredients exist
                FROM recipe_ingredients ri
                JOIN ingredients i ON ri.ingredient_id = i.id
                JOIN UoMs u ON ri.uom_id = u.id
                WHERE ri.recipe_id = r.id
            ) AS ingredients,
            (
                SELECT COALESCE(json_agg(
                    json_build_object(
                        'step_number', ins.step_number,
                        'instruction', ins.instruction
                    ) ORDER BY ins.step_number ASC
                ), '[]'::json) -- Return an empty array '[]' if no instructions exist
                FROM instructions ins
                WHERE ins.recipe_id = r.id
            ) AS instructions

        FROM
            recipes r
        WHERE
            r.id = $1;`
        const response = await db.query(query, [id])
        return response.rows[0] || null
    },
    async getIngredients() {
        const query = `SELECT id, name, category FROM ingredients;`
        const response = await db.query(query)
        return response.rows
    },
    async getUOM() {
        const query = `SELECT id, name FROM UoMs;`
        const response = await db.query(query)
        return response.rows
    },
    async createRecipe(recipeData) {
        try {
            const { title, servings, prep_time, cook_time, description, user_id, ingredients, instructions } = recipeData
            console.log('Creating recipe with data:', recipeData)
            const recipeInsertQuery = `
                INSERT INTO recipes (title, servings, prep_time, cook_time, description, user_id)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
            `
            console.log('Executing recipe insert query:', recipeInsertQuery)
            const recipeResult = await db.query( recipeInsertQuery,
                [title, servings, prep_time, cook_time, description || null, user_id]
            )
            console.log(recipeResult)
            const recipeId = recipeResult.rows[0].id // Get the ID of the newly inserted recipe

            if (ingredients && ingredients.length > 0) {
                for (const ingredient of ingredients) {
                    const {ingredient_id, notes, quantity, uom_id} = ingredient 
                    const recipeIngredientInsertQuery = `
                        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, uom_id, quantity, notes)
                        VALUES ($1, $2, $3, $4, $5);
                    `
                    const ingredientResult = await db.query(
                        recipeIngredientInsertQuery,
                        [recipeId, ingredient_id, uom_id, quantity, notes || null]
                    )
                    console.log('Inserted ingredient:', ingredientResult)
                }
            }

            // 3. Insert into instructions table
            if (instructions && instructions.length > 0) {
                for (const inst of instructions) {
                    const {step_number, instruction} = inst;

                    const instructionInsertQuery = `
                        INSERT INTO instructions (recipe_id, step_number, instruction)
                        VALUES ($1, $2, $3);
                    `;
                    await db.query(
                        instructionInsertQuery,
                        [recipeId, step_number, instruction]
                    )
                }
            }
            return recipeId; // Return the ID of the newly created recipe

        } catch (error) {
            console.error('Error creating recipe (transaction rolled back):', error);
            throw error;
        }
    },
       async updateRecipe(id, recipeData) {
        try {
            const { title, servings, prep_time, cook_time, description, ingredients, instructions } = recipeData;

            // 1. Update main recipes table (only update provided fields)
            const updateFields = [];
            const updateValues = [];
            const recipeId = parseInt(id, 10); // Ensure id is an integer

            if (title !== undefined) { updateFields.push('title = $1'); updateValues.push(title); }
            if (servings !== undefined) { updateFields.push('servings = $2'); updateValues.push(servings); }
            if (prep_time !== undefined) { updateFields.push('prep_time = $3'); updateValues.push(prep_time); }
            if (cook_time !== undefined) { updateFields.push('cook_time = $4'); updateValues.push(cook_time); }
            // Ensure description is explicitly set to null if it's passed as null/undefined to clear it
            if (description !== undefined) { updateFields.push('description = $5'); updateValues.push(description); }

            // Always update updated_at timestamp
            updateFields.push('updated_at = CURRENT_TIMESTAMP');

            if (updateFields.length > 0) {
                const recipeUpdateQuery = `
                    UPDATE recipes
                    SET ${updateFields.join(', ')}
                    WHERE id = $6;
                `;
                await db.query(recipeUpdateQuery, [...updateValues, recipeId]);
            }

            // delete existing, then re-insert new ones
            if (ingredients !== undefined) {
                await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1;`, [id]);
                 if (ingredients && ingredients.length > 0) {
                    for (const ingredient of ingredients) {
                        const {ingredient_id, notes, quantity, uom_id} = ingredient 
                        const recipeIngredientInsertQuery = `
                            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, uom_id, quantity, notes)
                            VALUES ($1, $2, $3, $4, $5);
                        `
                        const ingredientResult = await db.query(
                            recipeIngredientInsertQuery,
                            [recipeId, ingredient_id, uom_id, quantity, notes || null]
                        )
                        console.log('Inserted ingredient:', ingredientResult)
                    }
                }
            }
            
            // delete existing, then re-insert new ones)
            if (instructions !== undefined) {
                await db.query(`DELETE FROM instructions WHERE recipe_id = $1;`, [id]);
                if (instructions && instructions.length > 0) {
                    for (const inst of instructions) {
                        const {step_number, instruction} = inst;

                        const instructionInsertQuery = `
                            INSERT INTO instructions (recipe_id, step_number, instruction)
                            VALUES ($1, $2, $3);
                        `;
                        await db.query(
                            instructionInsertQuery,
                            [recipeId, step_number, instruction]
                        )
                    }
                }
            }
            return true; // success

        } catch (error) {

            console.error('Error updating recipe (transaction rolled back):', error)
            throw error
        }
    },

    async deleteRecipe(id) {
        try {
            const query = `
                DELETE FROM recipes
                WHERE id = $1;
            `
            const result = await db.query(query, [id])
            return id

        } catch (error) {
            console.error('Error deleting recipe:', error)
            throw error
        }
    }

};