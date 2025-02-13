import { Router } from 'express';
import { SavingController } from '../controllers/index.js';

const savingRouter = Router();

// Savings
savingRouter.get('/', SavingController.getAllSavings);
savingRouter.post('/', SavingController.addSaving);
savingRouter.get('/:savingsId', SavingController.getSaving);
savingRouter.put('/:savingsId', SavingController.updateSaving);
savingRouter.delete('/:savingsId', SavingController.deleteSaving);

export default savingRouter;
