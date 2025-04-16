import BankParserStrategy from '../BankParserStrategy.js';
import { PDFExtract } from 'pdf.js-extract';
import { isDateDayMonth } from '../utils/regexUtils.js';

//! current jusan.pdf was converted from jpg thats why not selectable and not reading it for now!.. 
//? in case there real transaction it must work! as an option u can keep it(cool yea) 
export default class JusanBankStrategy extends BankParserStrategy {
    async processTransactions() {
        if (!this.pdfPath) {
            return [];
        }

        try {
            const pdfExtract = new PDFExtract();
            const data = await pdfExtract.extract(this.pdfPath, {});

            const transactions = [];

            for (const page of data.pages) {
                const content = page.content;

                const dateHeader = content.find(item => item.str === "Date");
                if (!dateHeader) continue;

                const headerY = dateHeader.y;
                const descriptionHeader = content.find(item =>
                    Math.abs(item.y - headerY) < 5 &&
                    item.str === "Description"
                );

                const withdrawalsHeader = content.find(item =>
                    Math.abs(item.y - headerY) < 5 &&
                    item.str === "Withdrawals"
                );

                const depositsHeader = content.find(item =>
                    Math.abs(item.y - headerY) < 5 &&
                    item.str === "Deposits"
                );

                if (!descriptionHeader || !withdrawalsHeader || !depositsHeader) continue;

                const columns = {
                    date: dateHeader.x,
                    description: descriptionHeader.x,
                    withdrawals: withdrawalsHeader.x,
                    deposits: depositsHeader.x
                }

                const dateItems = content.filter(item =>
                    isDateDayMonth(item.str) &&
                    Math.abs(item.x - columns.date) < 50 &&
                    item.y > headerY
                )

                for (const dateItem of dateItems) {
                    const dateStr = dateItem.str;
                    const dateY = dateItem.y;

                    const rowItems = content.filter(item => Math.abs(item.y - dateY) < 5 && item.str.trim() !== "");
                    if (rowItems.length < 2) continue;

                    // "Opening Balance" row, skip 
                    if (rowItems.some(item => item.str.includes("Opening Balance"))) continue;

                    let description = "";
                    for (const item of rowItems) {
                        if (Math.abs(item.x - columns.description) < 50) {
                            description = item.str;
                            break;
                        }
                    }

                    let withdrawalAmount = 0;
                    for (const item of rowItems) {
                        if (Math.abs(item.x - columns.withdrawals) < 50 && isPlainDotDecimal(item.str)) {
                            withdrawalAmount = parseFloat(item.str);
                            break;
                        }
                    }

                    let depositAmount = 0;
                    for (const item of rowItems) {
                        if (Math.abs(item.x - columns.deposits) < 50 && isPlainDotDecimal(item.str)) {
                            depositAmount = parseFloat(item.str);
                            break;
                        }
                    }

                    // no transaction amount, skip
                    if (withdrawalAmount === 0 && depositAmount === 0) continue;

                    let amount = 0;
                    let type = "";

                    if (depositAmount > 0) {
                        amount = depositAmount;
                        type = "INCOME";
                    } else if (withdrawalAmount > 0) {
                        amount = withdrawalAmount;
                        type = "EXPENSE";
                    }

                    const [day, month] = dateStr.split("-");

                    // and get year from statement period. (what a weird statement)
                    const statementPeriodItem = content.find(item => item.str.includes("Statement Period:"));

                    let year = new Date().getFullYear().toString();
                    if (statementPeriodItem) {
                        const statementText = statementPeriodItem.str;
                        const yearMatch = statementText.match(/\d{4}/);
                        if (yearMatch) {
                            year = yearMatch[0];
                        }
                    }

                    const monthMap = {
                        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
                        "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
                        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
                    }

                    const monthNum = monthMap[month] || "01";
                    const paddedDay = day.padStart(2, "0");
                    const isoDate = new Date(`${year}-${monthNum}-${paddedDay}`).toISOString();

                    transactions.push({
                        createdAt: isoDate,
                        amount: amount,
                        type: type,
                        title: description
                    });
                }
            }

            return transactions;
        } catch (error) {
            return []; // no worries
        }
    }
}