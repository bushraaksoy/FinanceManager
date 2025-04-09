import { Router } from 'express';
import { ExpenseController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';

const expenseRouter = Router();

// Expense
expenseRouter.get(
    '/expenses',
    authenticateUserId,
    ExpenseController.getAllExpenses
);
expenseRouter.post(
    '/expenses',
    authenticateUserId,
    ExpenseController.addExpense
);
expenseRouter.get(
    '/expenses/:expenseId',
    authenticateUserId,
    ExpenseController.getExpense
);
expenseRouter.put(
    '/expenses/:expenseId',
    authenticateUserId,
    ExpenseController.updateExpense
);
expenseRouter.delete(
    '/expenses/:expenseId',
    authenticateUserId,
    ExpenseController.deleteExpense
);
expenseRouter.get(
    '/expense-category',
    authenticateUserId,
    ExpenseController.getExpenseCategories
);

export default expenseRouter;
