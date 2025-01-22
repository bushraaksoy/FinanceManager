import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import UserController from '../controllers/UserController.js';
import IncomeController from '../controllers/IncomeController.js';
import ExpenseController from '../controllers/ExpenseController.js';
import SavingController from '../controllers/SavingController.js';

const router = Router();

// Testing

router.get('/', (req, res) => {
    res.send({ message: 'testing one two' });
});

// Authentication
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// User
router.get('/users', UserController.getAllUsers);
router.get('/users/:userId', UserController.getUser);

// Income
router.get('/incomes', IncomeController.getAllIncomes);
router.post('/incomes', IncomeController.addIncome);
router.get('/incomes/:incomeId', IncomeController.getIncome);
router.put('/incomes/:incomeId', IncomeController.updateIncome);
router.delete('/incomes/:incomeId', IncomeController.deleteIncome);

// Expense
router.get('/expenses', ExpenseController.getAllExpenses);
router.post('/expenses', ExpenseController.addExpense);
router.get('/expenses/:expenseId', ExpenseController.getExpense);
router.put('/expenses/:expenseId', ExpenseController.updateExpense);
router.delete('/expenses/:expenseId', ExpenseController.deleteExpense);

// SavingsGoal
router.get('/savings', SavingController.getAllSavings);
router.post('/savings', SavingController.addSaving);
router.get('/savings/:savingsId', SavingController.getSaving);
router.put('/savings/:savingsId', SavingController.updateSaving);
router.delete('/savings/:savingsId', SavingController.deleteSaving);

export default router;
