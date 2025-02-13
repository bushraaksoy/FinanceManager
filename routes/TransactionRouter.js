import { Router } from 'express';
import { TransactionController } from '../controllers/index.js';

const transactionRouter = Router();

transactionRouter.get('', TransactionController.getTransactionHistory);
transactionRouter.post('', TransactionController.addTransaction);

export default transactionRouter;
