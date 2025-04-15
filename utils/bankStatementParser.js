// Sauce 🥫 --> https://mutasim77.github.io/design-patterns/#strategy-

// import as usual;
import { PdfReader } from 'pdfreader';

// INTERFACE(fake one) -> there's no interface in JS, so this will act like interface;
class BankParserStrategy {
    findHeaderIndex(rows) {
        throw new Error('findHeaderIndex method must be implemented');
    }

    processTransactions(rows) {
        throw new Error('processTransactions method must be implemented');
    }
}

// Concrete Strategy(A) for Kaspi bank(give me my money)
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
        // It's your own code. just minor changers(separation = more clear)
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

                const isoDate = new Date(
                    `${fullYear}-${month}-${day}`
                ).toISOString();

                return {
                    createdAt: isoDate,
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
        // no more headers? u can send me i will filter for u. my filter cute. pinch u <3
        return rows.findIndex((row) => row.includes('Total:'));
    }

    processTransactions(rows) {
        // same here -> ur proper transaction processing will be
        const headerIndex = this.findHeaderIndex(rows);
        const lastIndex = rows.findLastIndex(
            (row) => row.includes('Account') && row.includes('Number')
        );

        if (headerIndex === -1) return [];

        return rows.slice(headerIndex + 1, lastIndex);
    }
}

// Context CLASSSS that uses the strategy(my cute strategy)
class BankStatementParser {
    constructor(strategy) {
        this.strategy = strategy;
        this.rows = {};
        this.bankStatementRows = [];
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    // as u can see cute, following DRY just.
    // handling common PDF reading logic.
    // u can creat as many concrete strategies(banks) and yet use the same logic.
    async parseStatement(path) {
        return new Promise((resolve, reject) => {
            new PdfReader().parseFileItems(path, (err, item) => {
                if (err) {
                    console.error('error:', err);
                    reject(err);
                } else if (!item) {
                    console.warn('end of file');

                    Object.keys(this.rows).forEach((row) => {
                        this.bankStatementRows.push(this.rows[row]);
                    });

                    // here we just use our this.strategy; -> this.kaspiiii this.halykk this.cute ---> strategy to process transactions
                    const transactions = this.strategy.processTransactions(
                        this.bankStatementRows
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

// strategy Factory -> for dynamiclly selecting users' bank
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
        const bankType = 'kaspi';
        const bankStatement = 'bankstatement.pdf';

        const strategy = getStrategy(bankType);
        if (!strategy) throw new Error(`Opps! unsupported bank: ${bankType}`);

        // Parser with kaspi strategy(A)
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

// main();

export async function parsePdf(bankType, bankStatement) {
    try {
        const strategy = getStrategy(bankType);
        if (!strategy) throw new Error(`Opps! unsupported bank: ${bankType}`);

        // Parser with kaspi strategy(A)
        const parser = new BankStatementParser(strategy);
        let transactions = await parser.parseStatement(bankStatement);
        // console.log(
        //     `${bankType.toUpperCase()} Bank Transactions:`,
        //     transactions
        // );
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
