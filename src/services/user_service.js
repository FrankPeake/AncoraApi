import { id } from 'zod/locales';
import ERROR_MESSAGES from '../constants/error_messages.js';
import { userModel } from '../models/user_model.js';``
import CustomError from '../utils/custom_error.js';
import { OAuth2Client } from 'google-auth-library';
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const client = new OAuth2Client();

export const userService = {
    async getUserById(id) {
        const ticket = await client.verifyIdToken({
            idToken: id,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const google_id = payload['sub'];
        console.log('Response from Google API:', payload);
        const {sub, email, name, given_name, family_name, picture} =payload;
        if (payload) {
            const user = await userModel.getUserById(google_id)
            if (!user) {
                const newUser = await userModel.createUser({
                    google_id: sub,
                    email: email,
                    username: name,
                });
                if (!newUser) {
                    throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404)
                }
                return newUser
            }  
            return user
        }
    },
    async updateUser(id, userData) {    
        const sanitizeduserData = {
            ...userData,
            title: userData.title.trim(),
            servings: userData.servings,
            prep_time: userData.prep_time,
            cook_time: userData.cook_time,
            description: userData.description.trim(),
        }
        return await userModel.updateuser(id, sanitizeduserData);
    },
    async deleteUser(id) {    
        const deletedId = await userModel.deleteuser(id)
        return `Deleted user with ID: ${deletedId}`
    }
}
// This service can be used in the userController to handle business logic