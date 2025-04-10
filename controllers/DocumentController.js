import prisma from '../db/db.config.js';
import { parsePdf } from '../utils/bankStatementParser.js';
import openai from '../utils/openai.js';
import fs from 'fs/promises';

class DocumentController {
    static async uploadBankStatement(req, res) {
        // TODO: see what to do with expense category
        try {
            const userId = req.userId;
            const bank = req.params['bank'] || 'kaspi';
            const { cardId } = req.body;

            const filePath = `uploads/documents/${req.file.filename}`;

            let transactions = await parsePdf(bank, filePath);
            let count = 0;

            console.log('Starting to add transactions');
            for (const transaction of transactions.slice().reverse()) {
                const card = await prisma.card.findUnique({
                    where: { id: +cardId, userId },
                });
                const data = {
                    ...transaction,
                    userId,
                    cardId: +card.id,
                };

                if (transaction.type != 'INCOME') {
                    console.log(
                        `card balance: ${card.balance}, transaction amount: ${transaction.amount}`
                    );
                    if (card.balance >= transaction.amount) {
                        await prisma.$transaction([
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
                        });
                    }
                } else {
                    await prisma.$transaction([
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

            // console.log(transactions);
            console.log('done adding transactions');

            await fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send('Failed to delete file.');
                }
                console.log('File deleted successfully');
            });

            return res.status(200).send({ file: req.file, transactions });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Error uploading file' });
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
