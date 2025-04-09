import { Router } from 'express';
import { SavingController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';

const savingRouter = Router();

// Savings
savingRouter.get('/', authenticateUserId, SavingController.getAllSavings);
savingRouter.post('/', authenticateUserId, SavingController.addSaving);
savingRouter.get('/:savingId', authenticateUserId, SavingController.getSaving);
savingRouter.put(
    '/:savingId',
    authenticateUserId,
    SavingController.updateSaving
);
savingRouter.delete(
    '/:savingId',
    authenticateUserId,
    SavingController.deleteSaving
);

export default savingRouter;
