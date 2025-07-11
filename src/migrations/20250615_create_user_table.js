import db from '../config/db.js';

export async function up() {    
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    } catch (error) {
        console.error('Error creating users table:', error);
        throw error;
    }
}

export async function down() {
    try {
        await db.query(`
            DROP TABLE IF EXISTS users;
        `)
    } catch (error) {
        console.error('Error dropping users table:', error);
        throw error;
    }
}       

up()
    