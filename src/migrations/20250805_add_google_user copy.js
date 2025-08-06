import db from '../config/db.js';

export async function up() {    
    try {
        await db.query(`
            ALTER TABLE users ADD google_id VARCHAR(255) UNIQUE; 
        `)
    } catch (error) {
        console.error('Error altering users table:', error);
        throw error;
    }
}
up();