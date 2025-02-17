import prisma from '../db/db.config.js';

class ExpenseController {
    static async getAllExpenses(req, res) {
        try {
            const userId = req.headers['user-id'];
            const expenses = await prisma.expense.findMany({
                where: { userId },
            });
            res.status(200).send(expenses);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async getExpense(req, res) {
        try {
            const { expenseId } = req.params;

            const expense = await prisma.expense.findUnique({
                where: { id: +expenseId },
            });
            res.status(200).send(expense);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async addExpense(req, res) {
        try {
            const userId = req.headers['user-id'];
            const data = req.body;
            const category = data.category ? data.category : 'OTHER';
            console.log('data ', data);
            const expense = await prisma.expense.create({
                data: { ...data, userId, category },
            });
            res.status(200).send({
                message: 'Expense added successfully!',
                expense,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async updateExpense(req, res) {
        try {
            const { expenseId } = req.params;
            const data = req.body;
            const expense = await prisma.expense.update({
                where: { id: +expenseId },
                data,
            });
            res.status(200).send({
                message: 'Expense updated successfully!',
                expense,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async deleteExpense(req, res) {
        try {
            const { expenseId } = req.params;
            const expense = await prisma.expense.delete({
                where: { id: +expenseId },
            });
            res.status(200).send({
                message: 'Expense deleted successfully',
                expense,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async getExpenseCategories(req, res) {
        try {
            const userId = req.headers['user-id'];
            const expenses = await prisma.expense.findMany({
                where: { userId },
            });

            // transactions to get how much has been spent already:
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfNextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

            let totalExpenseSpending = {};
            const transactions = await prisma.transactionHistory.findMany({
                where: {
                    userId,
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                orderBy: { createdAt: 'desc' },
            });

            transactions.map((transaction) => {
                if (totalExpenseSpending[transaction.expenseId]) {
                    totalExpenseSpending[transaction.expenseId] +=
                        transaction.amount;
                } else {
                    totalExpenseSpending[transaction.expenseId] =
                        transaction.amount;
                }
            });

            const groupedExpenses = expenses.reduce((acc, expense) => {
                const categoryName = expense.category || 'OTHER';

                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                expense.usedAmount = totalExpenseSpending[expense.id] || 0;
                acc[categoryName].push(expense);
                return acc;
            }, {});

            console.log('total expense spending: ', totalExpenseSpending);

            res.status(200).send(groupedExpenses);
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
}

export default ExpenseController;
