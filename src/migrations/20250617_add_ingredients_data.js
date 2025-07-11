import db from '../config/db.js';
import fs from 'fs/promises'; // Import Node.js file system promises module
import path from 'path';     // Import path module for resolving file paths
import { fileURLToPath } from 'url'; // For resolving __dirname in ES Modules

// __filename and __dirname are not directly available in ES Modules.
// This block emulates their behavior to get the current directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up() {
    try {
        console.log('Starting migration: Seeding ingredients table...');

        // Construct the path to the ingredients.json file
        // Assumes ingredients.json is in the same directory as this migration file
        const ingredientsFilePath = path.resolve(__dirname, 'ingredients.json');

        // Read and parse the JSON file
        const data = await fs.readFile(ingredientsFilePath, 'utf8');
        const ingredientsData = JSON.parse(data);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const ingredient of ingredientsData) {
            const { name, category } = ingredient;
            // The query uses $1, $2 for PostgreSQL parameterized queries.
            // ON CONFLICT (name) DO NOTHING ensures that if an ingredient with the same name
            // already exists (due to a previous run or manual entry), it won't throw an error.
            const query = `
                INSERT INTO ingredients (name, category)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING;
            `;
            const result = await db.query(query, [name, category]);

            if (result.rowCount > 0) {
                insertedCount++;
            } else {
                skippedCount++; // Name already exists due to ON CONFLICT DO NOTHING
            }
        }
        console.log(`Successfully inserted ${insertedCount} ingredients. Skipped ${skippedCount} existing ingredients.`);
    } catch (error) {
        console.error('Error seeding ingredients table:', error);
        throw error;
    }
}

export async function down() {
    try {
        console.log('Starting rollback migration: Removing seeded ingredients...');

        // Construct the path to the ingredients.json file
        const ingredientsFilePath = path.resolve(__dirname, 'ingredients.json');

        // Read and parse the JSON file
        const data = await fs.readFile(ingredientsFilePath, 'utf8');
        const ingredientsData = JSON.parse(data);
        
        let deletedCount = 0;
        for (const ingredient of ingredientsData) {
            const { name } = ingredient;
            // Deletes the ingredient based on its name.
            const query = `
                DELETE FROM ingredients
                WHERE name = $1;
            `;
            const result = await db.query(query, [name]);
            if (result.rowCount > 0) {
                deletedCount++;
            }
        }
        console.log(`Successfully deleted ${deletedCount} ingredients.`);
    } catch (error) {
        console.error('Error reverting ingredients seed:', error);
        throw error;
    }
}

// If you run this file directly for testing, uncomment the following line:
up();
