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
            const userId = req.headers['user-id'];
            let currentBalance = await prisma.card.aggregate({
                where: { userId },
                _sum: { balance: true },
            });
            let totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            let totalExpenses = await prisma.expense.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            currentBalance = currentBalance._sum.balance || 0;
            totalIncome = totalIncome._sum.amount || 0;
            totalExpenses = totalExpenses._sum.amount || 0;

            const overview = {
                totalIncome,
                totalExpenses,
                currentBalance,
            };

            console.log(overview);
            return res.status(200).send(overview);
        } catch (error) {
            console.log(`error: ${error.message}`);
            return res.status(500).send({
                error: 'A server error occured getting balance overview',
            });
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

    static async getMonthlyTransactions(req, res) {
        try {
            const userId = req.headers['user-id'];
            let transactionSummary = await prisma.$queryRaw`
            WITH date_series AS (
            SELECT GENERATE_SERIES(
                DATE_TRUNC('month', CURRENT_DATE), 
                DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
                INTERVAL '1 day'
            ) AS date
            )
            SELECT 
                date_series.date AS date,
                COALESCE(SUM("amount"), 0) AS amount
            FROM date_series
            LEFT JOIN "TransactionHistory"
                ON DATE("createdAt") = date_series.date AND "userId" = ${userId} AND "type" = 'EXPENSE'
            GROUP BY date_series.date
            ORDER BY date_series.date ASC;

            `;

            // `
            // SELECT DATE("createdAt") AS date, SUM("amount") AS amount
            //     FROM "TransactionHistory"
            //     WHERE "userId" = ${userId} AND "type" = 'EXPENSE'
            //     GROUP BY DATE("createdAt")
            //     ORDER BY date ASC;
            // `;

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

    static async getTransactionSummary(req, res) {
        try {
            const userId = req.userId;
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
                    type: 'EXPENSE',
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                _sum: { amount: true },
            });
            let totalSaving = await prisma.transactionHistory.aggregate({
                where: {
                    userId,
                    type: 'SAVING',
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                _sum: { amount: true },
            });
            let totalIncome = await prisma.transactionHistory.aggregate({
                where: {
                    userId,
                    type: 'INCOME',
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                _sum: { amount: true },
            });

            totalSpending = totalSpending._sum.amount || 0;
            totalSaving = totalSaving._sum.amount || 0;
            totalIncome = totalIncome._sum.amount || 0;

            return res
                .status(200)
                .send({ totalSpending, totalSaving, totalIncome });
        } catch (error) {
            console.log(`error: ${error}`);
            return res.status(500).send({ error: 'A server error occured' });
        }
    }
}

export default AnalyticsController;
