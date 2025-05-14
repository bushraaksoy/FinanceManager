import prisma from '../db/db.config.js';

export const validateSavingId = async (req, res, next) => {
    try {
        const savingId = req.params['savingId'];
        const userId = req.userId;

        if (!savingId) {
            return res.status(400).send({ message: 'savingId is missing!' });
        }

        const saving = await prisma.saving.findUnique({
            where: { id: +savingId, userId },
        });

        if (!saving) {
            return res
                .status(404)
                .send({ message: 'Invalid savingId, Saving does not exist.' });
        }

        req.savingId = +savingId;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error validating savingId' });
    }
};
