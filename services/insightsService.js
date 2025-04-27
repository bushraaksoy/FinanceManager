import prisma from '../db/db.config.js';

export const fetchUserFinanceData = async (userId) => {
    try {
        const now = new Date();
        const start = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate
        );
        let incomes = await prisma.income.findMany({
            where: { userId },
            select: {
                id: true,
                description: true,
                title: true,
                amount: true,
                category: true,
                frequency: true,
            },
        });
        let expenses = await prisma.expense.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                description: true,
                amount: true,
                category: true,
                frequency: true,
            },
        });
        let savings = await prisma.saving.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                targetAmount: true,
                savedAmount: true,
                dueDate: true,
            },
        });
        let cards = await prisma.card.findMany({
            where: { userId },
            select: { id: true, title: true, balance: true },
        });

        let transactions = await prisma.transactionHistory.findMany({
            where: { userId },
        });

        // let transactions = await prisma.transactionHistory.findMany({
        //     where: { userId, createdAt: { gte: start, lte: now } },
        // });

        let data = { incomes, expenses, savings, cards, transactions };
        data = JSON.stringify(data, null);
        return data;
    } catch (error) {
        console.log('Error fetching user finance data: ', error.message);
    }
};
