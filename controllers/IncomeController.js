import prisma from '../db/db.config.js';

class IncomeController {
    // TODO: get income status of all incomes and balance left over (you can minus from all transactions made from that incomeId)

    static async getAllIncomes(req, res) {
        try {
            const userId = req.headers['user-id'];
            const incomes = await prisma.income.findMany({
                where: { userId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    amount: true,
                    frequency: true,
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
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async addIncome(req, res) {
        try {
            const userId = req.headers['user-id'];
            const data = req.body;
            console.log('data ', data);
            const income = await prisma.income.create({
                data: { ...data, userId },
            });
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
            const { incomeId } = req.params;
            const data = req.body;
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
}

export default IncomeController;
