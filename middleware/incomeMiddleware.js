import prisma from '../db/db.config.js';

export const validateIncomeId = async (req, res, next) => {
    try {
        const incomeId = req.params['incomeId'];
        const userId = req.userId;

        if (!incomeId) {
            return res.status(400).send({ message: 'incomeId is missing!' });
        }

        const income = await prisma.income.findUnique({
            where: { id: +incomeId, userId },
        });

        if (!income) {
            return res
                .status(404)
                .send({ message: 'Invalid incomeId, Income does not exist.' });
        }

        req.incomeId = +incomeId;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error validating incomeId' });
    }
};
