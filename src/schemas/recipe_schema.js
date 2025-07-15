import { z } from 'zod';

export const recipeSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    title: z.string().min(1, 'Title is required'),
    servings: z.string().min(1, 'Servings is required'),
    prep_time: z.string().min(1, 'Prep time is required'),
    cook_time: z.string().min(1, 'Cook time is required'),
    description: z.string().min(1, 'Description is required'),
    created_at: z.string(),
    updated_at: z.string(),
    ingredients: z.array(
        z.object({
            ingredient_id: z.number(),
            quantity: z.string().min(1, 'Quantity is required'),
            uom_id: z.number(),
            notes: z.string().optional()
        })
    ),
    instructions: z.array(
        z.object({
            step_number: z.number().int().positive('Step number must be a positive integer'),
            instruction: z.string().min(1, 'Instruction is required')
        })
    )
})

export const createRecipeSchema = recipeSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
})

export const updateRecipeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    servings: z.string().min(1, 'Servings is required'),
    prep_time: z.string().min(1, 'Prep time is required'),
    cook_time: z.string().min(1, 'Cook time is required'),
    description: z.string().min(1, 'Description is required'),
    ingredients: z.array(
        z.object({
            name: z.string().min(1, 'Ingredient name is required'),
            category: z.string().optional(),
            quantity: z.string().min(1, 'Quantity is required'),
            unit: z.string().min(1, 'Unit is required'),
            notes: z.string().optional()
        })
    ),
    instructions: z.array(
        z.object({
            step_number: z.number().int().positive('Step number must be a positive integer'),
            instruction: z.string().min(1, 'Instruction is required')
        })
    )
}).partial();
       