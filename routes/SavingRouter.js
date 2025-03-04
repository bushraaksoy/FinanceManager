import { Router } from 'express';
import { SavingController } from '../controllers/index.js';

const savingRouter = Router();

// Savings
savingRouter.get('/', SavingController.getAllSavings);
savingRouter.post('/', SavingController.addSaving);
savingRouter.get('/:savingId', SavingController.getSaving);
savingRouter.put('/:savingId', SavingController.updateSaving);
savingRouter.delete('/:savingId', SavingController.deleteSaving);

export default savingRouter;
