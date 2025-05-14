import { Router } from 'express';
import { SavingController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';
import { validateSavingId } from '../middleware/savingMiddleware.js';

const savingRouter = Router();

// Savings
savingRouter.get('/', authenticateUserId, SavingController.getAllSavings);
savingRouter.post('/', authenticateUserId, SavingController.addSaving);
savingRouter.get(
    '/:savingId',
    authenticateUserId,
    validateSavingId,
    SavingController.getSaving
);
savingRouter.get(
    '/:savingId/transactions',
    authenticateUserId,
    validateSavingId,
    SavingController.getSavingTransactions
);
savingRouter.put(
    '/:savingId',
    authenticateUserId,
    validateSavingId,
    SavingController.updateSaving
);
savingRouter.delete(
    '/:savingId',
    authenticateUserId,
    validateSavingId,
    SavingController.deleteSaving
);

export default savingRouter;
