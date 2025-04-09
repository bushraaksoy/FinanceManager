import { Router } from 'express';
import { IncomeController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';

const incomeRouter = Router();

// Income
incomeRouter.get('/', authenticateUserId, IncomeController.getAllIncomes);
incomeRouter.post('/', authenticateUserId, IncomeController.addIncome);
incomeRouter.get(
    '/pending',
    authenticateUserId,
    IncomeController.getPendingIncomes
);
incomeRouter.get('/:incomeId', authenticateUserId, IncomeController.getIncome);
incomeRouter.put(
    '/:incomeId',
    authenticateUserId,
    IncomeController.updateIncome
);
incomeRouter.delete(
    '/:incomeId',
    authenticateUserId,
    IncomeController.deleteIncome
);

export default incomeRouter;
