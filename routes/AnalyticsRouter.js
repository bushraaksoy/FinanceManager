import { Router } from 'express';
import { AnalyticsController } from '../controllers/index.js';

const analyticsRouter = Router();

// Analytics
analyticsRouter.get('/total-income', AnalyticsController.getTotalIncome);
analyticsRouter.get('/total-expenses', AnalyticsController.getTotalExpenses);
analyticsRouter.get('/survey-data', AnalyticsController.getSurveyData);
analyticsRouter.post('/survey-data', AnalyticsController.addSurveyData);
analyticsRouter.get(
    '/balance-overview',
    AnalyticsController.getBalanceOverview
);
analyticsRouter.get(
    '/budget-remainder',
    AnalyticsController.getBudgetRemainder
);

export default analyticsRouter;
