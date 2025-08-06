import db from '../config/db.js';

export async function up() {    
    try {
        await db.query(`
            ALTER TABLE users
            ALTER COLUMN password DROP NOT NULL;        `)
    } catch (error) {
        console.error('Error altering pw column:', error);
        throw error;
    }
}
up();