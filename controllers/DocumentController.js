import prisma from '../db/db.config.js';
import { parsePdf } from '../utils/bankStatementParser.js';
import { formatTransactionDate } from '../utils/formatters.js';
import openai from '../utils/openai.js';
import fs from 'fs/promises';

class DocumentController {
    static async uploadBankStatement(req, res) {
        try {
            const userId = req.userId;
            const bank = req.params['bank'] || 'kaspi';
            console.log(req.file);
            const filePath = `uploads/documents/${req.file.filename}`;

            let transactions = await parsePdf(bank, filePath);

            await fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send('Failed to delete file.');
                }
                console.log('File deleted successfully');
            });

            transactions = transactions.map((transaction) => {
                const date = formatTransactionDate(transaction['createdAt']);
                return { ...transaction, createdAt: date };
            });

            return res.status(200).send(transactions);
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Error uploading file' });
        }
    }

    static async confirmBankStatementTransactions(req, res) {
        try {
            const userId = req.userId;
            const { transactions } = req.body;
            const { cardId } = req.body;

            let count = 0;

            console.log('Starting to add transactions');

            // transactionIds[] -> list of transactions made, if insufficient balance, you loop and delete all
            for (const transaction of transactions.slice().reverse()) {
                const card = await prisma.card.findUnique({
                    where: { id: +cardId, userId },
                });
                const isoDate = new Date(transaction.createdAt).toISOString();
                const data = {
                    ...transaction,
                    userId,
                    createdAt: isoDate,
                    cardId: +card.id,
                };

                if (transaction.type != 'INCOME') {
                    console.log(
                        `card balance: ${card.balance}, transaction amount: ${transaction.amount}`
                    );
                    if (card.balance >= transaction.amount) {
                        await prisma.$transaction([
                            // asign to variable transaction and add transactionId to list
                            prisma.transactionHistory.create({ data }),

                            prisma.card.update({
                                where: { id: card.id, userId },
                                data: {
                                    balance: { increment: -transaction.amount },
                                },
                            }),
                        ]);
                        count++;
                        console.log(
                            `transaction ${count} added: `,
                            transaction
                        );
                    } else {
                        return res.status(400).send({
                            message: `Insufficient balance to complete the transaction, only ${count} transactions recorder.`,
                            // make a loop and delete all created transactions and deal with card balance!!
                        });
                    }
                } else {
                    await prisma.$transaction([
                        // asign to variable transaction and add transactionId to list
                        prisma.transactionHistory.create({ data }),

                        prisma.card.update({
                            where: { id: card.id, userId },
                            data: {
                                balance: { increment: transaction.amount },
                            },
                        }),
                    ]);
                    count++;
                }
            }

            console.log('done adding transactions');
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: 'failed to confirm bank statement transactions: ',
                error: error.message,
            });
        }
    }

    static async promptGpt(req, res) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    {
                        role: 'user',
                        content: `Create a healthy one week meal plan`,
                    },
                ],
            });
            res.status(200).send({ plan: response.choices[0].message.content });
        } catch (error) {}
    }
}

export default DocumentController;
