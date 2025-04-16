import BankParserStrategy from '../BankParserStrategy.js';
import { PDFExtract } from 'pdf.js-extract';
import {
    isAmountNoSign,
    isAmountWithSign,
    isDateLong,
} from '../utils/regexUtils.js';

// Concrete Strategy(B) for halyk Bank(ppl bank? whaat?)
export default class HalykBankStrategy extends BankParserStrategy {
    async processTransactions(rows) {
        if (!this.pdfPath) {
            return [];
        }

        try {
            const pdfExtract = new PDFExtract();
            const data = await pdfExtract.extract(this.pdfPath, {});

            const transactions = [];

            for (const page of data.pages) {
                const content = page.content;

                const tableHeaders = content.filter(
                    (item) =>
                        item.str === 'Date of transaction' ||
                        item.str === 'Transaction description' ||
                        item.str === 'Transaction amount'
                );

                if (tableHeaders.length === 0) {
                    continue;
                }

                const dateItems = content.filter((item) =>
                    isDateLong(item.str)
                );

                const processedPositions = new Set();

                for (const dateItem of dateItems) {
                    const dateStr = dateItem.str;
                    const dateY = dateItem.y;

                    // Skip already processed rows at this position. was duplicating thats why added this!
                    if (processedPositions.has(dateY)) {
                        continue;
                    }

                    processedPositions.add(dateY);

                    // Find all items on the same row
                    const rowItems = content.filter(
                        (item) =>
                            Math.abs(item.y - dateY) < 5 &&
                            item.str.trim() !== ''
                    );

                    // "Total:" or only "KZT" rows -> skip also
                    if (
                        rowItems.some(
                            (item) =>
                                item.str === 'Total:' ||
                                (item.str === 'KZT' && rowItems.length < 3)
                        )
                    ) {
                        continue;
                    }

                    let description = '';
                    for (const item of rowItems) {
                        if (
                            item.str === 'Transfer to another card' ||
                            item.str.includes('Receipt to the account') ||
                            item.str.includes('Monthly fee for card service')
                        ) {
                            description = item.str;
                            break;
                        }
                    }

                    let amount = 0;
                    for (const item of rowItems) {
                        if (isAmountWithSign(item.str)) {
                            amount = parseFloat(
                                item.str.replace(/\s/g, '').replace(',', '.')
                            );
                            break;
                        }
                    }

                    // transactions with zero amount -> skiip it
                    if (amount === 0) {
                        continue;
                    }

                    let creditValue = '0,00';
                    let debitValue = '0,00';
                    for (const item of rowItems) {
                        if (isAmountNoSign(item.str) && item.str !== dateStr) {
                            const creditItems = content.filter(
                                (c) =>
                                    c.str === 'Credit in account currency' ||
                                    c.str === 'Credit in account'
                            );

                            if (creditItems.length > 0) {
                                const creditColumnX = creditItems[0].x;
                                if (Math.abs(item.x - creditColumnX) < 50) {
                                    creditValue = item.str;
                                }
                            }
                        }
                    }

                    for (const item of rowItems) {
                        if (
                            isAmountWithSign(item.str) &&
                            item.str !== dateStr
                        ) {
                            const debitItems = content.filter(
                                (c) =>
                                    c.str === 'Debit in account currency' ||
                                    c.str === 'Debit in account'
                            );

                            if (debitItems.length > 0) {
                                const debitColumnX = debitItems[0].x;
                                if (Math.abs(item.x - debitColumnX) < 50) {
                                    debitValue = item.str;
                                }
                            }
                        }
                    }

                    let type = '';
                    const isZeroCredit =
                        creditValue === '0,00' ||
                        creditValue === '0.00' ||
                        creditValue === '0';
                    const isZeroDebit =
                        debitValue === '0,00' ||
                        debitValue === '0.00' ||
                        debitValue === '0';

                    if (isZeroCredit && !isZeroDebit) {
                        type = 'EXPENSE';
                    } else if (!isZeroCredit && isZeroDebit) {
                        type = 'INCOME';
                    } else {
                        type = amount < 0 ? 'EXPENSE' : 'INCOME';
                        amount = Math.abs(amount);
                    }

                    const [day, month, year] = dateStr.split('.');
                    const isoDate = new Date(
                        `${year}-${month}-${day}`
                    ).toISOString();

                    transactions.push({
                        createdAt: isoDate,
                        amount: Math.abs(amount),
                        type: type,
                        title: description || 'Unknown transaction',
                    });
                }
            }

            return transactions;
        } catch (error) {
            return [];
        }
    }

    setPdfPath(path) {
        this.pdfPath = path;
    }
}
