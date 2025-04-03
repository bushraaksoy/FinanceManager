import prisma from './db/db.config.js';

const initialiseCards = async () => {
    const cards = await prisma.card.updateMany({
        where: { balance: null },
        data: { balance: 0 },
    });
    console.log(cards);
};

const getAllCards = async () => {
    const cards = await prisma.card.findMany();
    console.log(cards);
};

const getAllTransactions = async () => {
    const transactions = await prisma.transactionHistory.findMany();
    console.log(transactions);
};

const deleteTransactionsWithoutCard = async () => {
    const transactions = await prisma.transactionHistory.deleteMany({
        where: { cardId: null },
    });
    console.log(transactions);
};

const updateCardsBalance = async () => {
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
            const transactions = await prisma.transactionHistory.findMany({
                where: { userId: user.id, cardId: card.id },
            });
            console.log(`$$ transactions of ${card.title} card:`, transactions);
            // get all incomes of cards that have length 0 of income transactions

            const incomeTransactions = await prisma.transactionHistory.findMany(
                { where: { userId: user.id, cardId: card.id, type: 'INCOME' } }
            );

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

            const newTransactions = await prisma.transactionHistory.findMany({
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
            console.log(`Card balance of ${card.title} card is ${balance}`);

            await prisma.card.update({
                where: { userId: user.id, id: card.id },
                data: { balance },
            });
        }
    }
};

// initialiseCards();
// getAllCards();
// getAllTransactions();
// deleteTransactionsWithoutCard();
// updateCardsBalance();
