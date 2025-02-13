import { Router } from 'express';

import authRouter from './AuthRouter.js';
import userRouter from './UserRouter.js';
import profileRouter from './ProfileRouter.js';
import incomeRouter from './IncomeRouter.js';
import expenseRouter from './ExpenseRouter.js';
import savingsRouter from './SavingRouter.js';
import transactionRouter from './TransactionRouter.js';
import analyticsRouter from './AnalyticsRouter.js';

const router = Router();

// Testing
router.get('/', (req, res) => {
    res.send({ message: 'testing one two' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/profile', profileRouter);
router.use('/incomes', incomeRouter);
router.use('', expenseRouter);
router.use('/savings', savingsRouter);
router.use('', transactionRouter);
router.use('/analytics', analyticsRouter);

export default router;
