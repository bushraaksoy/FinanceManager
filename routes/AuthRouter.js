import { Router } from 'express';
import { AuthController } from '../controllers/index.js';

const authRouter = Router();

// Authentication
authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);

export default authRouter;
