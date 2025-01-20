import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Authentication

router.get('/auth/login', AuthController.login);
router.get('/auth/register', AuthController.register);

export default router;
