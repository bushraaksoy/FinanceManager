import { Router } from 'express';
import { ProfileController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';

const profileRouter = Router();

//Profile
profileRouter.get('/', authenticateUserId, ProfileController.getUserProfile);
profileRouter.put('/', authenticateUserId, ProfileController.updateUserProfile);

export default profileRouter;
