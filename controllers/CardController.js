import prisma from '../db/db.config.js';

class CardController {
    static async getAllCards(req, res) {
        try {
            console.log('getAllCards attempt');
            const userId = req.headers['user-id'];
            const cards = await prisma.card.findMany({ where: { userId } });
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
    static async fixThings(req, res) {
        try {
            console.log('Starting to fix things...');
            const cards = await prisma.card.updateMany({
                where: { balance: null },
                data: { balance: 0 },
            });
            console.log(cards);
            console.log('Updated null balance cards');
            console.log(
                'Adding incomes to no income transaction cards and updating cards balance'
            );
            const users = await prisma.user.findMany();

            for (const user of users) {
                console.log('------------', user.username, '---------------');
                // get user cards
                const cards = await prisma.card.findMany({
                    where: { userId: user.id },
                });

                console.log('cards: ', cards);

                // loop over cards and get card transactions and count balance of cards
                for (const card of cards) {
                    const transactions =
                        await prisma.transactionHistory.findMany({
                            where: { userId: user.id, cardId: card.id },
                        });
                    console.log(
                        `$$ transactions of ${card.title} card:`,
                        transactions
                    );
                    // get all incomes of cards that have length 0 of income transactions

                    const incomeTransactions =
                        await prisma.transactionHistory.findMany({
                            where: {
                                userId: user.id,
                                cardId: card.id,
                                type: 'INCOME',
                            },
                        });

                    // we can just calculate and add the correct value instead of creating income transactions?
                    // nooo, lets create income transactions

                    if (incomeTransactions.length == 0) {
                        // const sum = await prisma.income.aggregate({
                        //     where: { userId: user.id, cardId: card.id },
                        //     _sum: { amount: true },
                        // });
                        // console.log('sum of incomes: ', sum._sum.amount);

                        const incomes = await prisma.income.findMany({
                            where: { userId: user.id, cardId: card.id },
                        });

                        console.log('incomes: ', incomes);

                        for (const income of incomes) {
                            const data = {
                                incomeId: income.id,
                                userId: user.id,
                                amount: income.amount,
                                cardId: income.cardId,
                                type: 'INCOME',
                                createdAt: income.createdAt,
                            };
                            await prisma.transactionHistory.create({ data });
                        }
                    }

                    const newTransactions =
                        await prisma.transactionHistory.findMany({
                            where: { userId: user.id, cardId: card.id },
                        });
                    console.log(
                        `$$ new transactions of ${card.title} card:`,
                        newTransactions
                    );

                    let balance = 0;

                    for (const transaction of newTransactions) {
                        if (transaction.type == 'INCOME') {
                            balance += transaction.amount;
                        } else {
                            balance -= transaction.amount;
                        }
                    }
                    console.log(
                        `Card balance of ${card.title} card is ${balance}`
                    );

                    await prisma.card.update({
                        where: { userId: user.id, id: card.id },
                        data: { balance },
                    });
                }
            }
            console.log('process is done!!');
            res.status(200).send('Card balances fixed successfully!!');
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'failed to fix things' });
        }
    }
}

export default CardController;
