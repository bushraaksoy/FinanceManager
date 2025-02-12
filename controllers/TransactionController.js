import prisma from '../db/db.config.js';

class TransactionController {
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

            const transactions = await prisma.transactionHistory.findMany({
                where: {
                    userId,
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
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

    static async addTransaction(req, res) {
        try {
            const userId = req.headers['user-id'];
            const type = req.query['type'];
            const data = req.body;
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
                .sent({ message: 'Specify valid type param' });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    //! DELETE THE BELOW TWO
    static async addExpenseTransaction(req, res) {
        try {
            const userId = req.headers['user-id'];
            const data = req.body; // data: {amount: Float, expenseId: Int}
            const expenseTransaction = await prisma.transactionHistory.create({
                data: { ...data, userId, type: 'EXPENSE' },
            });
            console.log(expenseTransaction);
            return res.status(200).send({
                message: 'Expense transaction added successfully!',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async addSavingsTransaction(req, res) {
        try {
            const userId = req.headers['user-id'];
            const data = req.body; // data: {amount: Float, savingId: Int}
            const savingTransaction = await prisma.transactionHistory.create({
                data: { ...data, userId, type: 'SAVING' },
            });
            await prisma.saving.update({
                where: { id: data.savingId },
                data: { savedAmount: { increment: data.amount } },
            });
            res.status(200).send({
                message: 'Saving transaction added successfully!',
                savingTransaction,
            });
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
