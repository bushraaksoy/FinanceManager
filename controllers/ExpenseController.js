import prisma from '../db/db.config.js';

class ExpenseController {
    static async getAllExpenses(req, res) {
        try {
            const userId = req.headers['user-id'];
            const expenses = await prisma.expense.findMany({
                where: { userId },
            });
            res.status(200).send({ expenses: expenses });
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
            res.status(200).send({ expense });
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
            console.log('data ', data);
            const expense = await prisma.expense.create({
                data: { ...data, userId },
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
}

export default ExpenseController;
