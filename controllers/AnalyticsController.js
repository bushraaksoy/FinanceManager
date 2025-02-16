import prisma from '../db/db.config.js';

class AnalyticsController {
    static async getTotalIncome(req, res) {
        try {
            const userId = req.headers['user-id'];
            const totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });
            res.status(200).send({ totalIncome: totalIncome._sum.amount });
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
        try {
            const userId = req.headers['user-id'];
            const data = req.body;
            // TODO: handle body.monthlyIncome separately. create a new income for that instead, and add rest to surveyData
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
            let totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            let totalExpenses = await prisma.expense.aggregate({
                where: { userId },
                _sum: { amount: true },
            });

            totalIncome = totalIncome._sum.amount;
            totalExpenses = totalExpenses._sum.amount;

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
            totalSpending = totalSpending._sum.amount;

            const currentBalance = totalIncome - totalSpending;

            return res.status(200).send({
                totalIncome,
                totalExpenses,
                totalSpending,
                currentBalance,
            });
        } catch (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send({ error: 'A server error occured' });
        }
    }

    // GET
    // /incomeOverview
    // /incomeTrend
    // /expenseOverview
    // /expenseTrend
}

export default AnalyticsController;
