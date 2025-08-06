import { id } from 'zod/locales';
import ERROR_MESSAGES from '../constants/error_messages.js';
import { userModel } from '../models/user_model.js';``
import CustomError from '../utils/custom_error.js';
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const userService = {
    async getUserById(google_id) {
        console.log('Fetching user with Google ID:', google_id);
        const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${google_id}`
        );
        console.log('Response from Google API:', response.data);
        const {sub, email, name, given_name, family_name, picture} = response.data;
        if (response.status == 200) {
            const user = await userModel.getuserById(google_id)
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