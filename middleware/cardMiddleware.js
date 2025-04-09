import prisma from '../db/db.config.js';

export const validateCardId = async (req, res, next) => {
    try {
        let data = req.body;
        let userId = req.userId;

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
        req.card = card;
        next();
    } catch (error) {
        console.log('error validating cardId', error);
        return res.status(500).send({ message: 'error validating cardId' });
    }
};

export const checkBalance = async (req, res, next) => {
    try {
        const card = req.card;
        const data = req.body;

        if (card.balance < data.amount) {
            return res.status(403).send({ message: 'Insufficient Balance!' });
        }
        next();
    } catch (error) {
        console.log('error checking card balance', error);
        return res.status(500).send({ message: 'error checking card balance' });
    }
};
