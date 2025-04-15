import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';
import { validateCardId, checkBalance } from '../middleware/cardMiddleware.js';

const transactionRouter = Router();

transactionRouter.get(
    '/',
    authenticateUserId,
    TransactionController.getTransactions
);
transactionRouter.put(
    '/:transactionId',
    authenticateUserId,
    TransactionController.updateTransaction
);
transactionRouter.delete(
    '/:transactionId',
    authenticateUserId,
    TransactionController.deleteTransaction
);
transactionRouter.post(
    '/saving',
    authenticateUserId,
    validateCardId,
    checkBalance,
    TransactionController.addSavingTransaction
);
transactionRouter.post(
    '/expense',
    authenticateUserId,
    validateCardId,
    checkBalance,
    TransactionController.addExpenseTransaction
);
transactionRouter.post(
    '/income',
    authenticateUserId,
    TransactionController.addIncomeTransaction
);
transactionRouter.post(
    '/upload',
    upload.single('bankstatement'),
    TransactionController.uploadBankStatement
);

export default transactionRouter;
