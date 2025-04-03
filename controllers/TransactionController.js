import prisma from '../db/db.config.js';
import { formatDate, formatTransactionDate } from '../utils/formatters.js';

class TransactionController {
    //! TODO: update the balance of a card if cardId is available in the transaction.
    //! TODO: handle transactions when expenses are deleted, or when cards are deleted.
    static async getAllTransactions(req, res) {
        try {
            const userId = req.headers['user-id'];
            const transactions = await prisma.transactionHistory.findMany({
                where: { userId },
                include: {
                    card: {
                        select: {
                            title: true,
                        },
                    },
                    expense: {
                        select: {
                            title: true,
                        },
                    },
                    income: {
                        select: {
                            title: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).send(transactions);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async getTransactionHistory(req, res) {
        // order by date decending
        try {
            const userId = req.headers['user-id'];
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfNextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

            let transactions = await prisma.transactionHistory.findMany({
                where: {
                    userId,
                    // type: 'EXPENSE',
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                include: {
                    card: {
                        select: {
                            title: true,
                        },
                    },
                    expense: {
                        select: {
                            title: true,
                        },
                    },
                    income: {
                        select: {
                            title: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            transactions = transactions.map((transaction) => {
                const date = formatTransactionDate(transaction['createdAt']);
                return { ...transaction, createdAt: date };
            });

            res.status(200).send(transactions);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async addExpenseTransaction(req, res) {
        // cardId is available?
        // card has enough balance?
        try {
            const userId = req.headers['user-id'];
            let data = req.body;
            console.log(data);

            if (!data.cardId) {
                return res.status(400).send({ message: 'cardId is missing!' });
            }

            const card = await prisma.card.findUnique({
                where: { id: +data.cardId, userId },
            });

            if (!card) {
                return res
                    .status(404)
                    .send({ message: 'Invalid cardId. Card does not exist.' });
            }

            if (card.balance < data.amount) {
                return res
                    .status(403)
                    .send({ message: 'Insufficient Balance!' });
            }

            data = {
                ...data,
                expenseId: +data.expenseId,
                cardId: +data.cardId,
                amount: +data.amount,
                userId,
                type: 'EXPENSE',
            };

            await prisma.card.update({
                where: { id: +data.cardId },
                data: { balance: { increment: -data.amount } },
            });

            console.log('adding transaction: ', data);
            const expenseTransaction = await prisma.transactionHistory.create({
                data,
            });
            return res.status(200).send({
                message: 'Expense transaction added successfully!',
                expenseTransaction,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async addSavingTransaction(req, res) {
        // cardId is available? code 400
        // card has enough balance?
        // userId not found

        try {
            const userId = req.headers['user-id'];
            let data = req.body;
            data = data.cardId
                ? {
                      ...data,
                      savingId: +data.savingId,
                      cardId: +data.cardId,
                      amount: +data.amount,
                      userId,
                      type: 'SAVING',
                  }
                : {
                      ...data,
                      savingId: +data.savingId,
                      amount: +data.amount,
                      userId,
                      type: 'SAVING',
                  };
            const savingTransaction = await prisma.transactionHistory.create({
                data,
            });
            await prisma.saving.update({
                where: { id: data.savingId },
                data: { savedAmount: { increment: data.amount } },
            });
            return res.status(200).send({
                message: 'Saving transaction added successfully',
                savingTransaction,
            });
        } catch (error) {
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async addIncomeTransaction(req, res) {
        try {
            //! should the user have to enter the amount also or just the incomeId is sufficient?
            const userId = req.headers['user-id'];
            let data = req.body;

            if (!data.incomeId) {
                return res
                    .status(400)
                    .send({ message: 'incomeId is missing!' });
            }

            const income = await prisma.income.findUnique({
                where: { id: +data.incomeId, userId },
            });

            // make sure the income belongs to the user?? nahh just add it to the request
            if (!income) {
                return res.status(404).send({
                    message: 'Invalid incomeId. Income does not exist.',
                });
            }

            data = {
                ...data,
                incomeId: +income.id,
                cardId: +income.cardId,
                amount: +income.amount,
                userId,
                type: 'INCOME',
            };

            // add income transaction to transactionHistory
            const incomeTransaction = await prisma.transactionHistory.create({
                data,
            });

            // update the card
            await prisma.card.update({
                where: { id: income.cardId },
                data: { balance: { increment: income.amount } },
            });

            return res.status(200).send({
                message: 'Income transaction added successfully',
                incomeTransaction,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async updateTransaction(req, res) {
        try {
            console.log('requesting transaction update');
            const userId = req.headers['user-id'];
            const { transactionId } = req.params;
            const data = req.body;
            await prisma.transactionHistory.update({
                where: { id: +transactionId, userId },
                data,
            });
            return res
                .status(200)
                .send({ message: 'Transaction updated successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async deleteTransaction(req, res) {
        try {
            console.log('requesting transaction delete');
            // const userId = req.headers['user-id'];
            const { transactionId } = req.params;
            const data = req.body;
            const transaction = await prisma.transactionHistory.delete({
                where: { id: +transactionId },
            });

            await prisma.card.update({
                where: { id: transaction.cardId },
                data: { balance: { increment: -transaction.amount } },
            });

            return res
                .status(200)
                .send({ message: 'Transaction deleted successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
}

export default TransactionController;
