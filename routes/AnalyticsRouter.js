import { Router } from 'express';
import { AnalyticsController } from '../controllers/index.js';

const analyticsRouter = Router();

// Analytics
analyticsRouter.get('/total-income', AnalyticsController.getTotalIncome);
analyticsRouter.get('/total-expenses', AnalyticsController.getTotalExpenses);
// analyticsRouter.get(
//     '/balance-overview',
//     AnalyticsController.getBalanceOverview
// );

export default analyticsRouter;
