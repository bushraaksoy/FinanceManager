import { PdfReader } from 'pdfreader';

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

                const transactions = bankStatementRows.map((row) => {
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

// const pdfPath = './bankstatement.pdf';

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

const rows = await extractHalykBankStatementData(pdfPath);
console.log(rows);
