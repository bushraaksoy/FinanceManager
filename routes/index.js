import { Router } from 'express';

import authRouter from './AuthRouter.js';
import userRouter from './UserRouter.js';
import profileRouter from './ProfileRouter.js';
import incomeRouter from './IncomeRouter.js';
import expenseRouter from './ExpenseRouter.js';
import savingsRouter from './SavingRouter.js';
import transactionRouter from './TransactionRouter.js';
import analyticsRouter from './AnalyticsRouter.js';
import cardRouter from './CardRouter.js';
import documentRouter from './DocumentRouter.js';
import chatRouter from './ChatRouter.js';

const router = Router();

// Testing
router.get('/', (req, res) => {
    res.send({ message: 'testing one two' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/profile', profileRouter);
router.use('/incomes', incomeRouter);
router.use('/expenses', expenseRouter);
router.use('/savings', savingsRouter);
router.use('/transactions', transactionRouter);
router.use('/analytics', analyticsRouter);
router.use('/cards', cardRouter);
router.use('/document', documentRouter);
router.use('/chat', chatRouter);

export default router;
