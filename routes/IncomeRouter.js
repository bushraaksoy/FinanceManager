import { Router } from 'express';
import { IncomeController } from '../controllers/index.js';

const incomeRouter = Router();

// Income
incomeRouter.get('/', IncomeController.getAllIncomes);
incomeRouter.post('/', IncomeController.addIncome);
incomeRouter.get('/:incomeId', IncomeController.getIncome);
incomeRouter.put('/:incomeId', IncomeController.updateIncome);
incomeRouter.delete('/:incomeId', IncomeController.deleteIncome);

export default incomeRouter;
