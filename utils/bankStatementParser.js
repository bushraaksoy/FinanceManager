// Sauce 🥫 --> https://mutasim77.github.io/design-patterns/#strategy-

// import as usual;
import { PdfReader } from 'pdfreader';
import { isAmountNoSign } from '../services/statement-parser/utils/regexUtils.js';

class BankParserStrategy {
    findHeaderIndex(rows) {
        throw new Error('findHeaderIndex method must be implemented');
    }

    processTransactions(rows) {
        throw new Error('processTransactions method must be implemented');
    }
}

class KaspiBankStrategy extends BankParserStrategy {
    findHeaderIndex(rows) {
        return rows.findIndex(
            (row) =>
                row.includes('Date') &&
                row.includes('Amount') &&
                row.includes('Transaction') &&
                row.includes('Details')
        );
    }

    processTransactions(rows) {
        const headerIndex = this.findHeaderIndex(rows);
        if (headerIndex === -1) return [];

        const transactionRows = rows.slice(headerIndex + 1);
        transactionRows.pop();

        return transactionRows
            .filter((row) => row.length >= 4)
            .map((row) => {
                const amount = parseFloat(
                    row[1].replace(/[-+₸ ]/g, '').replace(',', '.')
                );
                const type = row[2] == 'Replenishment' ? 'INCOME' : 'EXPENSE';

                const [day, month, year] = row[0].split('.');
                const fullYear = year.length === 2 ? `20${year}` : year; // assume 20xx

                return {
                    createdAt: `${day}.${month}.${fullYear}`,
                    amount: amount,
                    type: type,
                    title: row[3],
                };
            });
    }
}

// Concrete Strategy(B) for halyk Bank(ppl bank? whaat?)
class HalykBankStrategy extends BankParserStrategy {
    findHeaderIndex(rows) {
        return rows.findIndex((row) => row.includes('Total:'));
    }

    findFooterIndex(rows) {
        return rows.findLastIndex(
            (row) => row.includes('Account') && row.includes('Number')
        );
    }

    processTransactions(rows) {
        const headerIndex = this.findHeaderIndex(rows);
        const lastIndex = this.findFooterIndex(rows);
        const transactions = [];

        if (headerIndex === -1) return [];

        rows = rows.slice(headerIndex + 1, lastIndex);

        const unwantedWords = [
            'Total:',
            'Account',
            'Number',
            'Date',
            'Fee',
            'currency',
        ];
        rows = rows.filter(
            (row) => !unwantedWords.some((word) => row.includes(word))
        );

        rows = rows.map((row, inx) => {
            const convertedRow = row.map((str) => {
                if (isAmountNoSign(str)) {
                    return parseFloat(
                        str.replace(/[\u00A0 ]/g, '').replace(',', '.')
                    );
                }
                return str;
            });

            return convertedRow;
        });

        let cleanedRows = [];

        rows.forEach((row, inx) => {
            if (row.length >= 9) {
                // merge description
                let description = row[2];
                let i = 3;

                while (i < row.length) {
                    const value = row[i];
                    if (typeof value == 'number' || value == '-') {
                        break;
                    }
                    description += ' ' + value;
                    row.splice(i, 1);
                }
                row[2] = description;
                return cleanedRows.push(row);
            } else {
                const str = row.join(' ');
                cleanedRows[cleanedRows.length - 1][2] += ' ' + str;
            }
        });

        for (const row of cleanedRows) {
            let title = row[2]
                .replace(/Merchant Payment Transaction/gi, '')
                .trim();

            if (row.includes('-')) {
                transactions.push({
                    createdAt: row[0],
                    title: title,
                    amount: row.at(-3),
                    type: 'EXPENSE',
                });
            } else {
                transactions.push({
                    createdAt: row[0],
                    title: title,
                    amount: row.at(-4),
                    type: 'INCOME',
                });
            }
        }

        return transactions;
    }
}

class BankStatementParser {
    constructor(strategy) {
        this.strategy = strategy;
        this.rows = {};
        this.rows = [];
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async parseStatement(path) {
        return new Promise((resolve, reject) => {
            new PdfReader().parseFileItems(path, (err, item) => {
                if (err) {
                    console.error('error:', err);
                    reject(err);
                } else if (!item) {
                    console.warn('end of file');

                    Object.keys(this.rows).forEach((row) => {
                        this.rows.push(this.rows[row]);
                    });

                    const transactions = this.strategy.processTransactions(
                        this.rows
                    );
                    resolve(transactions);
                } else if (item.text) {
                    const row = this.rows[item.y] || [];
                    row.push(item.text.trim());
                    this.rows[item.y] = row;
                }
            });
        });
    }
}

function getStrategy(bankType) {
    // u can place it somewhere else even and get rid of this function. but it's just better and more readable.
    const strategies = {
        kaspi: new KaspiBankStrategy(),
        halyk: new HalykBankStrategy(),
    };

    return strategies[bankType] || null;
}

// example how to use:
async function main() {
    try {
        // let's say this type is users selected bank from the frontend(will be selection options) -> and send via qury param;
        const bankType = 'halyk';
        const bankStatement = 'halykbankstatement.pdf';

        const strategy = getStrategy(bankType);
        if (!strategy) throw new Error(`Opps! unsupported bank: ${bankType}`);

        const parser = new BankStatementParser(strategy);
        let transactions = await parser.parseStatement(bankStatement);

        console.log(
            `${bankType.toUpperCase()} Bank Transactions:`,
            transactions
        );
    } catch (error) {
        console.error('Irror parsing statement:', error);
    }
}

export async function parsePdf(bankType, bankStatement) {
    try {
        const strategy = getStrategy(bankType);
        if (!strategy) throw new Error(`Opps! unsupported bank: ${bankType}`);

        const parser = new BankStatementParser(strategy);
        let transactions = await parser.parseStatement(bankStatement);

        return transactions;
    } catch (error) {
        console.error('Error parsing statement:', error);
    }
}

//====================24-Feb 2025====================

// here's the link to the Strategy Pattern in case: https://mutasim77.github.io/design-patterns/#strategy-
// (and ofc, advertising my own repo ahahahaha 😌)

// you can keep adding more banks(million of them) But remember!!! -> u re cute <3 )

// DDDDo what you want.
// Keep going.,,. KEEEPP adding strategies 🗣️🔥🔥
// Until one day... you break it.
// And you'll be SO done with it all.
// That's when you do:
// `rm -rf /*` 🔥 (aka tech suicide) -> the one i did it once early morning, almost, but then... )
// I thought about my cute. My pinchable one. My baby. What if she needs help with strategy Pattern? 😭
// And I cannot pinch??! AAAAAAA. Nouuu
// So I stopped it. For my cutest one 💖
// Binching you fully and srslyy!

// -----------------------------
// Pinch you the amount of every byte and line of code here,
// every tiny bit and every white space that holds meaning between the lines of code
// Maybe even one extra 💖

// 🗣️ UPDATEEE:
// Counted for you, and it shows 6174 bytes.
// But it's so little, so we convert it to base 2 (we go to what's native to our machines right?)
// and now we have 1100000011110... so pinch you this much!💖

// (And if you wonder how, here:)
/* 
import fs from 'fs';

fs.readFile('./bankStatementParser.js', (err, data) => {
    if (err) return console.error('Error:', err);
    
    const byteSize = Buffer.byteLength(data, 'utf8');
    console.log(`Byte Size: ${byteSize} bytes \nBinary: ${byteSize.toString(2)}`);
});
*/
