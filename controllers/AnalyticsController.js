import prisma from '../db/db.config.js';
import { formatTransactionDate } from '../utils/formatters.js';

class AnalyticsController {
    //! TODO: write another calculation to take leftover balance from all cards?

    static async getTotalIncome(req, res) {
        try {
            const userId = req.headers['user-id'];
            let totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });
            totalIncome = totalIncome._sum.amount;
            res.status(200).send({ totalIncome });
        } catch (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send({ error: 'A server error occured' });
        }
    }

    static async getTotalExpenses(req, res) {
        try {
            const userId = req.headers['user-id'];
            const totalExpenses = await prisma.expense.aggregate({
                where: { userId },
                _sum: { amount: true },
            });
            res.status(200).send({ totalExpenses: totalExpenses._sum.amount });
        } catch (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send({ error: 'A server error occured' });
        }
    }

    static async addSurveyData(req, res) {
        // TODO: handle body.monthlyIncome separately. create a new income for that instead, and add rest to surveyData
        try {
            const userId = req.headers['user-id'];
            const data = req.body;
            await prisma.surveyData.create({
                data: { ...data, userId },
            });
            return res.status(200).send({
                message: 'Survey Data added successfully!',
                data,
            });
        } catch (error) {
            console.log(`Error occured adding survey data: ${error}`);
            res.sendStatus(500);
        }
    }

    static async getSurveyData(req, res) {
        try {
            const userId = req.headers['user-id'];
            const surveyData = await prisma.surveyData.findFirst({
                where: { userId },
            });
            return res.status(200).send(surveyData);
        } catch (error) {
            console.log(`Error occured getting survey data: ${error}`);
            res.sendStatus(500);
        }
    }

    static async getBalanceOverview(req, res) {
        try {
            console.log('attempt to get balance overview');

            const userId = req.headers['user-id'];
            let totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            let totalExpenses = await prisma.expense.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            totalIncome = totalIncome._sum.amount || 0;
            totalExpenses = totalExpenses._sum.amount || 0;

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfNextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

            let totalSpending = await prisma.transactionHistory.aggregate({
                where: {
                    userId,
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                _sum: { amount: true },
            });
            totalSpending = totalSpending._sum.amount || 0;

            const currentBalance = totalIncome - totalSpending;

            const overview = {
                totalIncome,
                totalExpenses,
                totalSpending,
                currentBalance,
            };

            console.log(overview);
            return res.status(200).send(overview);
        } catch (error) {
            console.log(`error: ${error.message}`);
            return res.status(500).send({ error: 'A server error occured' });
        }
    }

    static async getBudgetRemainder(req, res) {
        try {
            const userId = req.headers['user-id'];
            let totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            let totalExpenses = await prisma.expense.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            totalIncome = totalIncome._sum.amount || 0;
            totalExpenses = totalExpenses._sum.amount || 0;

            const budgetRemainder = totalIncome - totalExpenses;
            console.log(budgetRemainder);

            return res.status(200).send({ budgetRemainder });
        } catch (error) {
            console.log(`error: ${error}`);
            return res.status(500).send({ error: 'A server error occured' });
        }
    }

    static async getTransactionSummary(req, res) {
        try {
            const userId = req.headers['user-id'];
            let transactionSummary = await prisma.$queryRaw`
            SELECT DATE("createdAt") AS date, SUM("amount") AS amount
                FROM "TransactionHistory"
                WHERE "userId" = ${userId}
                GROUP BY DATE("createdAt")
                ORDER BY date ASC;
            `;

            transactionSummary = transactionSummary.map((transaction) => {
                const date = formatTransactionDate(transaction['date']);
                return { ...transaction, date };
            });

            return res.status(200).send(transactionSummary);
        } catch (error) {
            console.log(`error: ${error}`);
            return res.status(500).send({ error: 'A server error occured' });
        }
    }

    // GET
    // /incomeOverview
    // /incomeTrend
    // /expenseOverview
    // /expenseTrend
}

export default AnalyticsController;
