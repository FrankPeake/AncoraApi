import {Router} from 'express';
import { FollowController } from '../controllers/follow_controller.js';
const router = Router()

router.get('/feed/:id', FollowController.getFeedById)

export default router
