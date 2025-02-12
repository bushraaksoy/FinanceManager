import { Router } from 'express';
import { ProfileController } from '../controllers/index.js';
import { authenticateJWT } from '../middleware/AuthMiddleware.js';

const profileRouter = Router();

//Profile
profileRouter.get('/', ProfileController.getUserProfile);
profileRouter.put('/', ProfileController.updateUserProfile);

export default profileRouter;
