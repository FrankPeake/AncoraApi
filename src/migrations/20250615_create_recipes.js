import db from '../config/db.js';
export async function up() {    
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS recipes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                servings INTEGER NOT NULL,
                prep_time INTEGER NOT NULL,
                cook_time INTEGER NOT NULL,
                description TEXT,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS UoMs (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE
            );
            CREATE TABLE IF NOT EXISTS ingredients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                category VARCHAR(100)
            );
            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
                notes TEXT,
                ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
                uom_id INTEGER NOT NULL REFERENCES UoMs(id) ON DELETE CASCADE,
                quantity VARCHAR(100) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS instructions (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
                step_number INTEGER NOT NULL,
                instruction TEXT NOT NULL,
                UNIQUE (recipe_id, step_number)
            );  
        `)
    } catch (error) {
        console.error('Error creating recipes table:', error);
        throw error;
    }
}

export async function down() {
    try {
        await db.query(`
            DROP TABLE IF EXISTS instructions;
            DROP TABLE IF EXISTS recipe_ingredients;
            DROP TABLE IF EXISTS ingredients;
            DROP TABLE IF EXISTS UoMs;
            DROP TABLE IF EXISTS recipes;
        `);
    } catch (error) {
        console.error('Error dropping recipes table:', error);
        throw error;
    }
}       

up()