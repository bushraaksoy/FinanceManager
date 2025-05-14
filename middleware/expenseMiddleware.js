import prisma from '../db/db.config.js';

export const validateExpenseId = async (req, res, next) => {
    try {
        const expenseId = req.params['expenseId'];
        const userId = req.userId;

        if (!expenseId) {
            return res.status(400).send({ message: 'expenseId is missing!' });
        }

        const expense = await prisma.expense.findUnique({
            where: { id: +expenseId, userId },
        });

        if (!expense) {
            return res.status(404).send({
                message: 'Invalid expenseId, Expense does not exist.',
            });
        }

        req.expenseId = +expenseId;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error validating expenseId' });
    }
};
