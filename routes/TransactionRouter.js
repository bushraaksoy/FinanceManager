import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';

const transactionRouter = Router();

transactionRouter.get(
    '/transaction-history',
    TransactionController.getTransactionHistory
);
transactionRouter.post('/transactions', TransactionController.addTransaction);

export default transactionRouter;
