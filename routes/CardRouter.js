import { Router } from 'express';
import CardController from '../controllers/CardController.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';

const cardRouter = Router();

cardRouter.get('', authenticateUserId, CardController.getAllCards);
cardRouter.get('/:cardId', authenticateUserId, CardController.getCard);
cardRouter.get(
    '/:cardId/transactions',
    authenticateUserId,
    CardController.getCardTransactions
);
cardRouter.post('', authenticateUserId, CardController.addCard);
cardRouter.put('/:cardId', authenticateUserId, CardController.updateCard);
cardRouter.delete('/:cardId', authenticateUserId, CardController.deleteCard);

export default cardRouter;
