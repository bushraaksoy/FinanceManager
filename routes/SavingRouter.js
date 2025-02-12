import { Router } from 'express';
import { SavingController } from '../controllers/index.js';

const savingRouter = Router();

// Savings
savingRouter.get('/savings', SavingController.getAllSavings);
savingRouter.post('/savings', SavingController.addSaving);
savingRouter.get('/savings/:savingsId', SavingController.getSaving);
savingRouter.put('/savings/:savingsId', SavingController.updateSaving);
savingRouter.delete('/savings/:savingsId', SavingController.deleteSaving);

export default savingRouter;
