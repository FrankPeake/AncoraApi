export const FollowController = {

    async getFeedById(req, res, next) {
        const { id } = req.params
        try {
            const user = await followService.getFeedById(id)
            if (!user) {
                return res.status(404).json({ error: 'user not found' })
            }
            res.status(200).json(user)
        } catch (error) {
            next(error) 
        }
    },
 }

 import { followService } from '../services/follow_service.js';