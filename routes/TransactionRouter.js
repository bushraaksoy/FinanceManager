import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';

const transactionRouter = Router();

transactionRouter.get('', TransactionController.getTransactionHistory);
transactionRouter.post('', TransactionController.addTransaction);
transactionRouter.put(
    '/:transactionId',
    TransactionController.updateTransaction
);

export default transactionRouter;
