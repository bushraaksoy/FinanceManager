import { Router } from 'express';
import CardController from '../controllers/CardController.js';

const cardRouter = Router();

cardRouter.get('', CardController.getAllCards);
cardRouter.get('/details', CardController.getCardsDetails);
cardRouter.get('/fix', CardController.fixThings);
cardRouter.get('/:cardId', CardController.getCard);
cardRouter.post('', CardController.addCard);
cardRouter.put('/:cardId', CardController.updateCard);
cardRouter.delete('/:cardId', CardController.deleteCard);

export default cardRouter;
