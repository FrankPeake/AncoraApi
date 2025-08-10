import { id } from 'zod/locales';
import ERROR_MESSAGES from '../constants/error_messages.js';
import CustomError from '../utils/custom_error.js';
import { OAuth2Client } from 'google-auth-library';
import { FollowModel } from '../models/follow_model.js';

const client = new OAuth2Client();

export const followService = {
    async getFeedById(id) {
        return FollowModel.getFeedById(id)
    },
}
// This service can be used in the userController to handle business logic