import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';

const transactionRouter = Router();

transactionRouter.get(
    '/transaction-history',
    TransactionController.getTransactionHistory
);
transactionRouter.post(
    '/add-transaction',
    TransactionController.addTransaction
);

export default transactionRouter;
