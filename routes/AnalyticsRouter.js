import { Router } from 'express';
import { AnalyticsController } from '../controllers/index.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';
const analyticsRouter = Router();

// Analytics
analyticsRouter.get(
    '/survey-data',
    authenticateUserId,
    AnalyticsController.getSurveyData
);
analyticsRouter.post(
    '/survey-data',
    authenticateUserId,
    AnalyticsController.addSurveyData
);
analyticsRouter.get(
    '/total-income',
    authenticateUserId,
    AnalyticsController.getTotalIncome
);
analyticsRouter.get(
    '/total-expenses',
    authenticateUserId,
    AnalyticsController.getTotalExpenses
);
analyticsRouter.get(
    '/balance',
    authenticateUserId,
    AnalyticsController.getCurrentBalance
);
analyticsRouter.get(
    '/balance-overview',
    authenticateUserId,
    AnalyticsController.getBalanceOverview
);
analyticsRouter.get(
    '/budget-remainder',
    AnalyticsController.getBudgetRemainder
);
analyticsRouter.get(
    '/transactions',
    authenticateUserId,
    AnalyticsController.getMonthlyTransactions
);
analyticsRouter.get(
    '/transaction-summary',
    authenticateUserId,
    AnalyticsController.getTransactionSummary
);
analyticsRouter.get(
    '/monthly-comparison',
    authenticateUserId,
    AnalyticsController.getMonthlyComparison
);
analyticsRouter.get(
    '/spending-trends',
    authenticateUserId,
    AnalyticsController.getSpendingTrends
);

export default analyticsRouter;
