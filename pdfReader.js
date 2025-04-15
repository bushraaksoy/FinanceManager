import { PdfReader } from 'pdfreader';
import 'dotenv/config';
import openai from './utils/openai.js';
import fs from 'fs';
// import pdf from 'pdf-parse';

const extractKaspiBankStatementData = async (path) => {
    return new Promise((resolve, reject) => {
        const rows = {};
        let bankStatementRows = [];

        new PdfReader().parseFileItems(path, (err, item) => {
            if (err) {
                console.error('error:', err);
                reject(err);
            } else if (!item) {
                console.warn('end of file');
                Object.keys(rows).map((row) => {
                    bankStatementRows.push(rows[row]);
                });

                const headerIndex = bankStatementRows.findIndex(
                    (row) =>
                        row.includes('Date') &&
                        row.includes('Amount') &&
                        row.includes('Transaction') &&
                        row.includes('Details')
                );

                bankStatementRows =
                    headerIndex != -1
                        ? bankStatementRows.slice(headerIndex + 1)
                        : bankStatementRows;

                bankStatementRows.pop();

                const transactions = bankStatementRows
                    .filter((row) => row.length >= 4)
                    .map((row) => {
                        let transactionType =
                            row[2] == 'Replenishment' ? 'INCOME' : 'EXPENSE';

                        // console.log(transactionType);

                        let amount = row[1].slice(1, -1).trim();
                        const commaIndex = amount.indexOf(',');
                        amount = amount.slice(0, commaIndex).replace(' ', '');
                        amount = +amount;
                        return {
                            createdAt: row[0],
                            amount,
                            type: transactionType,
                            title: row[3],
                        };
                    });

                resolve(transactions);
            } else if (item.text) {
                const row = rows[item.y] || [];
                row.push(item.text.trim());
                rows[item.y] = row;
            }
        });
    });
};

// const pdfPath = './aprilbankstatement.pdf';

// const transactions = await extractKaspiBankStatementData(pdfPath);
// console.log(transactions);

const extractHalykBankStatementData = async (path) => {
    return new Promise((resolve, reject) => {
        const rows = {};
        let bankStatementRows = [];

        new PdfReader().parseFileItems(path, (err, item) => {
            if (err) {
                console.error('error:', err);
                reject(err);
            } else if (!item) {
                console.warn('end of file');

                Object.keys(rows).map((row) => {
                    bankStatementRows.push(rows[row]);
                });

                const headerIndex = bankStatementRows.findIndex((row) =>
                    row.includes('Total:')
                );

                const lastIndex = bankStatementRows.findLastIndex(
                    (row) => row.includes('Account') && row.includes('Number')
                );

                bankStatementRows =
                    headerIndex != -1
                        ? bankStatementRows.slice(headerIndex + 1, lastIndex)
                        : bankStatementRows;

                resolve(bankStatementRows);
            } else if (item.text) {
                const row = rows[item.y] || [];
                row.push(item.text.trim());
                rows[item.y] = row;
                // console.log(item.text);
            }
        });
    });
};

const pdfPath = './halykbankstatement.pdf';
// const rows = await extractHalykBankStatementData(pdfPath);
// console.log(rows);

const testChatGpt = async () => {
    const dataBuffer = fs.readFileSync('./halykbankstatement.pdf');

    // Wrap pdfreader's callback in a Promise
    const extractTextFromPdf = (buffer) => {
        return new Promise((resolve, reject) => {
            const reader = new PdfReader();
            let textContent = '';

            reader.parseBuffer(buffer, (err, item) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(textContent); // end of file
                } else if (item.text) {
                    textContent += item.text + ' ';
                }
            });
        });
    };

    try {
        const pdfText = await extractTextFromPdf(dataBuffer);

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt2,
                },
                {
                    role: 'user',
                    content: pdfText,
                },
            ],
        });

        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

testChatGpt();

const prompt = `parse this bankstatement. you may find tables belonging to different accounts. give me the data from the bank statement in form of an array of jsons. each item in the array represents one of the accounts found. if only one account, then only one json in the array. json of the account needs two things accountDetails and transactions 
          - "transactions": [{ "createdAt", "title", "amount", "type" }]
          - "accountDetails": { "accountNumber", "currency" } 
             for transaction type it is INCOME or EXPENSE. please do not respond with any other text excwpt the array of objects. and include every single transaction that has been scanned. for title, do not include the text merchant payment transaction and only include what comes after
             and only include the debit in account currency for the amount.
           `;

const prompt2 = `
        You are an expert data parser.

        Below is raw OCR-scanned text extracted from a bank statement PDF.  
        Your task is to convert it into a strict JSON array.

        ## Requirements:
        - The result must ONLY be a JSON array of objects, no extra text, explanation or commentary.
        - If there are multiple accounts, return an array with multiple objects. If only one, the array should have one object.
        - Each object must have:
        - **accountDetails**: { "accountNumber": string, "currency": string }
        - **transactions**: array of { "createdAt": string, "title": string, "amount": number, "type": "INCOME" | "EXPENSE" }
        - Use **only the debit in account currency** for the amount if its an EXPENSE and Use **credit in account currency** if its an INCOME.
        - For **type**, it can only be "INCOME" or "EXPENSE".
        - For **title**, remove the phrase "**merchant payment transaction**" and keep what follows.
        - For accounts that dont have transactions, dont include them

        ## Example:
        [
        {
            "accountDetails": {
            "accountNumber": "KZ123456789",
            "currency": "KZT"
            },
            "transactions": [
            { "createdAt": "2024-04-05", "title": "Starbucks", "amount": 1200, "type": "EXPENSE" },
            { "createdAt": "2024-04-06", "title": "Salary", "amount": 300000, "type": "INCOME" }
            ]
        }
        ]

`;
