import db from '../config/db.js';

 export const FollowModel = {
 
    async getFeedById(id) {
        const query = 
        `SELECT
            r.id AS recipe_id,
            r.title,
            r.prep_time,
            r.cook_time,
            r.servings,
            r.created_at,
            r.description,
            u.username AS author_username,
            u.id AS author_id
        FROM
            recipes AS r
        JOIN
            users AS u ON r.user_id = u.id
        WHERE
            r.user_id IN (
                SELECT followed_id
                FROM follows
                WHERE follower_id = $1 -- ID of the logged-in user
            )
            OR r.user_id = $1 -- Include posts by the current user
        ORDER BY
            r.created_at DESC
        LIMIT 20 OFFSET 0; -- Get the first 20 posts for the newsfeed`
        const response = await db.query(query, [id])
        return response.rows || null
    },
    
};