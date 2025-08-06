export const UserController = {

    async getUserById(req, res, next) {
        const { id } = req.params
        try {
            const user = await userService.getUserById(id)
            if (!user) {
                return res.status(404).json({ error: 'user not found' })
            }
            res.status(200).json(user)
        } catch (error) {
            next(error) 
        }
    },
    async updateUser(req, res, next) {
        const { id } = req.params
        const userData = req.body
        try {
            const updateduser = await userService.updateUser(id, userData)
            res.status(200).json(updateduser)
        } catch (error) {
            next(error) 
        }
    },
    async deleteUser(req, res, next) {
        const { id } = req.params
        try {
            const message = await userService.deleteUser(id)
            res.status(200).json({ message })
        } catch (error) {
            next(error) 
        }
    }
 }

 import { userService } from '../services/user_service.js';