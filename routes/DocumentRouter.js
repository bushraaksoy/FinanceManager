import { Router } from 'express';
import DocumentController from '../controllers/DocumentController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';
import { validateCardId } from '../middleware/cardMiddleware.js';

const documentRouter = Router();

documentRouter.post(
    '/bankstatement',
    upload.single('bankstatement'),
    authenticateUserId,
    DocumentController.uploadBankStatement
);
documentRouter.post(
    '/confirmBankstatement',
    authenticateUserId,
    validateCardId,
    DocumentController.confirmBankStatementTransactions
);

documentRouter.get('/gpt', DocumentController.promptGpt);

export default documentRouter;
