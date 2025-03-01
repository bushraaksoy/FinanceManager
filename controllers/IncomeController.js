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
            console.error(error);
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
}

export default IncomeController;
