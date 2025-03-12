import prisma from '../db/db.config.js';

class CardController {
    static async getAllCards(req, res) {
        try {
            console.log('getAllCards attempt');
            const userId = req.headers['user-id'];
            const cards = await prisma.card.findMany({ where: { userId } });
            console.log(cards);
            return res.status(200).send(cards);
        } catch (error) {
            console.log('server error: ', error);
            return res.status(500).send({ message: error.message });
        }
    }
    static async getCard(req, res) {
        try {
            const userId = req.headers['user-id'];
            const cardId = req.params['cardId'];
            const card = await prisma.card.findUnique({
                where: { userId, id: +cardId },
            });
            return res.status(200).send(card);
        } catch (error) {
            console.log('server error: ', error);
            return res.status(500).send({ message: error.message });
        }
    }
    static async addCard(req, res) {
        try {
            const userId = req.headers['user-id'];
            const data = req.body; // data: {title}
            const card = await prisma.card.create({
                data: { ...data, userId },
            });
            return res
                .status(200)
                .send({ message: 'Card added successfully!', card });
        } catch (error) {
            console.log('server error: ', error);
            return res.status(500).send({ message: error.message });
        }
    }
    static async updateCard(req, res) {
        try {
            // const userId = req.headers['user-id'];
            const cardId = req.params['cardId'];
            const data = req.body;
            const card = await prisma.card.update({
                where: { id: +cardId },
                data,
            });
            return res
                .status(200)
                .send({ message: 'Card updated successfully', card });
        } catch (error) {
            console.log('server error: ', error);
            return res.status(500).send({ message: error.message });
        }
    }
    static async deleteCard(req, res) {
        try {
            // const userId = req.headers['user-id'];
            const cardId = req.params['cardId'];
            const card = await prisma.card.delete({ where: { id: +cardId } });
            return res
                .status(200)
                .send({ message: 'Card deleted successfully!', card });
        } catch (error) {
            console.log('server error: ', error);
            return res.status(500).send({ message: error.message });
        }
    }

    static async getCardsDetails(req, res) {
        try {
            const userId = req.headers['user-id'];
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfNextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

            let cards = await prisma.card.findMany({
                where: { userId },
                select: { id: true, title: true },
            });

            const totalTransactions = await prisma.transactionHistory.groupBy({
                by: 'cardId',
                where: {
                    userId,
                    NOT: { cardId: null },
                    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
                },
                _sum: { amount: true },
            });

            const totalIncomes = await prisma.income.groupBy({
                by: 'cardId',
                where: { userId, NOT: { cardId: null } },
                _sum: { amount: true },
            });

            // transactions:  [ { _sum: { amount: 4 }, cardId: 2 } ]
            // totalIncomes:  [ { _sum: { amount: 10000 }, cardId: 2 } ]

            const cardsBalance = {};
            totalIncomes.map((income) => {
                cardsBalance[income.cardId] = income._sum.amount;
            });

            totalTransactions.map((transactions) => {
                cardsBalance[transactions.cardId] =
                    cardsBalance[transactions.cardId] -
                    transactions._sum.amount;
            });

            const allCards = cards.map((card) => ({
                ...card,
                balance: cardsBalance[card.id] || 0,
            }));

            return res.status(200).send(allCards);
        } catch (error) {
            console.log('server error: ', error);
            return res.status(500).send({ message: error.message });
        }
    }
}

export default CardController;
