import { Router } from 'express';
import { UserController } from '../controllers/index.js';

const userRouter = Router();

// User
userRouter.get('/', UserController.getAllUsers);
userRouter.get('/:userId', UserController.getUser);
userRouter.put('/:userId', UserController.updateUser);

export default userRouter;
