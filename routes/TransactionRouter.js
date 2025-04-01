import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';

const transactionRouter = Router();

transactionRouter.get('', TransactionController.getTransactionHistory);
transactionRouter.get('/all', TransactionController.getAllTransactions);
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

export default transactionRouter;
