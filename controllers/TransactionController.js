import prisma from '../db/db.config.js';
import { formatDate, formatTransactionDate } from '../utils/formatters.js';

class TransactionController {
    //! TODO: update the balance of a card if cardId is available in the transaction.
    //! TODO: handle transactions when expenses are deleted, or when cards are deleted.
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

    static async addTransaction(req, res) {
        try {
            console.log('adding transaction');
            const userId = req.headers['user-id'];
            const type = req.query['type'];
            const data = req.body;
            console.log(req.body);
            if (type == 'EXPENSE') {
                const expenseTransaction =
                    await prisma.transactionHistory.create({
                        data: { ...data, userId, type },
                    });
                console.log(expenseTransaction);
                return res.status(200).send({
                    message: 'Expense transaction added successfully!',
                });
            } else if (type == 'SAVING') {
                const savingTransaction =
                    await prisma.transactionHistory.create({
                        data: { ...data, userId, type: 'SAVING' },
                    });
                await prisma.saving.update({
                    where: { id: data.savingId },
                    data: { savedAmount: { increment: data.amount } },
                });
                return res.status(200).send({
                    message: 'Saving transaction added successfully!',
                    savingTransaction,
                });
            }

            return res
                .status(400)
                .send({ message: 'Specify valid type param' });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async addExpenseTransaction(req, res) {
        try {
            const userId = req.headers['user-id'];
            let data = req.body;
            console.log(data);

            data = data.cardId
                ? {
                      ...data,
                      expenseId: +data.expenseId,
                      cardId: +data.cardId,
                      amount: +data.amount,
                      userId,
                      type: 'EXPENSE',
                  }
                : {
                      ...data,
                      expenseId: +data.expenseId,
                      amount: +data.amount,
                      userId,
                      type: 'EXPENSE',
                  };

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
        try {
            const userId = req.headers['user-id'];
            let data = req.body;
            data = { ...data, userId, type: 'SAVING' };
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
            console.log('requesting transaction update');
            // const userId = req.headers['user-id'];
            const { transactionId } = req.params;
            const data = req.body;
            await prisma.transactionHistory.delete({
                where: { id: +transactionId },
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
