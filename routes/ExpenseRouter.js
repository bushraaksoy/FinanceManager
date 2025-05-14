import { Router } from 'express';
import { ExpenseController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';
import { validateExpenseId } from '../middleware/expenseMiddleware.js';

const expenseRouter = Router();

// Expense
expenseRouter.get('/', authenticateUserId, ExpenseController.getAllExpenses);
expenseRouter.post('/', authenticateUserId, ExpenseController.addExpense);
expenseRouter.get(
    '/:expenseId',
    authenticateUserId,
    ExpenseController.getExpense
);
expenseRouter.get(
    '/:expenseId',
    authenticateUserId,
    validateExpenseId,
    ExpenseController.getExpense
);
expenseRouter.get(
    '/:expenseId/transactions',
    authenticateUserId,
    validateExpenseId,
    ExpenseController.getExpenseTransactions
);
expenseRouter.put(
    '/:expenseId',
    authenticateUserId,
    ExpenseController.updateExpense
);
expenseRouter.delete(
    '/:expenseId',
    authenticateUserId,
    ExpenseController.deleteExpense
);
expenseRouter.get(
    '/expense-category',
    authenticateUserId,
    ExpenseController.getExpenseCategories
);

export default expenseRouter;
