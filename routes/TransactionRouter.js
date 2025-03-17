import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';

const transactionRouter = Router();

transactionRouter.get('', TransactionController.getTransactionHistory);
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

export default transactionRouter;
