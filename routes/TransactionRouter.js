import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';
import upload from '../middleware/uploadMiddleware.js';

const transactionRouter = Router();

transactionRouter.get('/', TransactionController.getTransactions);
transactionRouter.put(
    '/:transactionId',
    TransactionController.updateTransaction
);
transactionRouter.delete(
    '/:transactionId',
    TransactionController.deleteTransaction
);
transactionRouter.post('/saving', TransactionController.addSavingTransaction);
transactionRouter.post('/expense', TransactionController.addExpenseTransaction);
transactionRouter.post('/income', TransactionController.addIncomeTransaction);
transactionRouter.post(
    '/upload',
    upload.single('bankstatement'),
    TransactionController.uploadBankStatement
);

export default transactionRouter;
