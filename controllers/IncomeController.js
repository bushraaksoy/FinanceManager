import prisma from '../db/db.config.js';

class IncomeController {
    // TODO: get income status of all incomes and balance left over (you can minus from all transactions made from that incomeId)
    //! TODO: adding and updating income should check if it has cardId, if so we need to add the balance to the card
    //! TODO: when a user makes a transaction they select a card if they have more than one card

    static async getAllIncomes(req, res) {
        try {
            console.log('getting all incomes');
            const userId = req.headers['user-id'];
            const incomes = await prisma.income.findMany({
                where: { userId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    amount: true,
                    frequency: true,
                    cardId: true,
                    category: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            res.status(200).send(incomes);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async getIncome(req, res) {
        try {
            const { incomeId } = req.params;

            const income = await prisma.income.findUnique({
                where: { id: +incomeId },
            });
            res.status(200).send(income);
        } catch (error) {
            console.error(error, 'error getting single income');
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async addIncome(req, res) {
        try {
            // TODO handle cardId
            console.log('attempt to add income');
            const userId = req.headers['user-id'];
            let data = req.body;
            console.log('data ', data);

            if (data.cardId) {
                data = {
                    ...data,
                    amount: +data.amount,
                    cardId: +data.cardId,
                    userId,
                };
            } else {
                data = { ...data, amount: +data.amount, userId };
            }

            const income = await prisma.income.create({ data });

            res.status(200).send({
                message: 'Income added successfully!',
                income,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async updateIncome(req, res) {
        try {
            //TODO Handle cardId
            console.log('attempt to update income');
            const { incomeId } = req.params;
            let data = req.body;

            if (data.cardId) {
                data = { ...data, cardId: +data.cardId };
            }

            const income = await prisma.income.update({
                where: { id: +incomeId },
                data,
            });

            res.status(200).send({
                message: 'Income updated successfully!',
                income,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async deleteIncome(req, res) {
        try {
            //! should we do anything to the card if a user deletes an income???
            const { incomeId } = req.params;
            const income = await prisma.income.delete({
                where: { id: +incomeId },
            });
            res.status(200).send({
                message: 'Income deleted successfully',
                income,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async getPendingIncomes(req, res) {
        try {
            // let pendingIncomes = []
            // transactions: get all income transactions

            // weeklyIncomes: get all weekly incomes
            // monthlyIncomes: get all monthly incomes

            // check if we have any income ids from weekly incomes in transactions, if we have check if created at > 7 then add to list if yes, and add to list if its not in transactions (can do every mondays)
            // check if we have any income ids from monthly incomes in transactions, if we have check if created at > 1 month then add to list if yes, and add to list if its not in transactions (can do every 1st of the month?)

            const userId = req.headers['user-id'];
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            // Fetch all income transactions in one query
            const incomeTransactions = await prisma.transactionHistory.findMany(
                {
                    where: { userId, type: 'INCOME' },
                    select: { incomeId: true, createdAt: true },
                }
            );

            // Convert transactions to a Map for quick lookups
            const transactionMap = new Map();
            incomeTransactions.forEach((transaction) => {
                transactionMap.set(transaction.incomeId, transaction.createdAt);
            });
            console.log('transactionMap', transactionMap);

            // Fetch all incomes in one go
            const incomes = await prisma.income.findMany({
                where: { userId },
                // select: { id: true, frequency: true },
            });

            console.log('incomes', incomes);

            let pendingIncomes = [];

            // Process incomes
            incomes.forEach((income) => {
                const lastTransactionDate = transactionMap.get(income.id);
                const isMissing = !lastTransactionDate;
                console.log(isMissing);

                if (income.frequency === 'DAILY') {
                    if (
                        isMissing ||
                        new Date(lastTransactionDate).toDateString() !==
                            now.toDateString()
                    ) {
                        pendingIncomes.push(income);
                    }
                } else if (income.frequency === 'WEEKLY') {
                    if (
                        isMissing ||
                        new Date(lastTransactionDate) < startOfWeek
                    ) {
                        pendingIncomes.push(income);
                    }
                } else if (income.frequency === 'MONTHLY') {
                    if (
                        isMissing ||
                        new Date(lastTransactionDate) < startOfMonth
                    ) {
                        pendingIncomes.push(income);
                    }
                }
            });
            console.log('pendingIncomes', pendingIncomes);
            res.status(200).send(pendingIncomes);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
}

export default IncomeController;
