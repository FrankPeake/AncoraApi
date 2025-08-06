import {Router} from 'express';
import { UserController } from '../controllers/user_controller.js';
const router = Router()

router.get('/:id', UserController.getUserById)
router.put('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

export default router
