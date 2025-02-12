import { Router } from 'express';
import { ExpenseController } from '../controllers/index.js';

const expenseRouter = Router();

// Expense
expenseRouter.get('/expenses', ExpenseController.getAllExpenses);
expenseRouter.post('/expenses', ExpenseController.addExpense);
expenseRouter.get('/expenses/:expenseId', ExpenseController.getExpense);
expenseRouter.put('/expenses/:expenseId', ExpenseController.updateExpense);
expenseRouter.delete('/expenses/:expenseId', ExpenseController.deleteExpense);
expenseRouter.get('/expense-category', ExpenseController.getExpenseCategories);

export default expenseRouter;
