 import db from '../config/db.js';

 export const userModel = {
 
    async getUserById(id) {
        const query = 
        `SELECT
            r.id,
            r.username,
            r.email,
            r.google_id
        FROM
            users r
        WHERE
            r.google_id = $1;`
        const response = await db.query(query, [id])
        return response.rows[0] || null
    },
    async createUser(userData) {
        try {
            const { username, email, google_id } = userData
            console.log('Creating user with data:', userData)
            const userInsertQuery = `
                INSERT INTO users (username, email, google_Id)
                VALUES ($1, $2, $3) RETURNING id;
            `
            console.log('Executing user insert query:', userInsertQuery)
            const userResult = await db.query( userInsertQuery,
                [username, email, google_id || null]
            )
            console.log(userResult)
            const userId = userResult.rows[0].id // Get the ID of the newly inserted user
            return userId; // Return the ID of the created user

        } catch (error) {
            console.error('Error creating user (transaction rolled back):', error);
            throw error;
        }
    },
    // async updateUser(id, userData) {
    //     try {

    //         if (updateFields.length > 0) {
    //             const userUpdateQuery = `
    //                 UPDATE users
    //                 SET ${updateFields.join(', ')}
    //                 WHERE id = $6;
    //             `;
    //             await db.query(userUpdateQuery, [...updateValues, userId]);
    //         }
    //         return true; // success

    //     } catch (error) {

    //         console.error('Error updating user (transaction rolled back):', error)
    //         throw error
    //     }
    // },

    async deleteUser(id) {
        try {
            const query = `
                DELETE FROM users
                WHERE id = $1;
            `
            const result = await db.query(query, [id])
            return id

        } catch (error) {
            console.error('Error deleting user:', error)
            throw error
        }
    }

};