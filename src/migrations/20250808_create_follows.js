import db from '../config/db.js';

export async function up() {    
    try {
        await db.query(`
            CREATE TABLE follows (
                follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                followed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (follower_id, followed_id) -- Ensures a user can only follow another user once
            );        `)
    } catch (error) {
        console.error('Error altering pw column:', error);
        throw error;
    }
}
up();