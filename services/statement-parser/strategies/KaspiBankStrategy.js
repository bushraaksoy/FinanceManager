import BankParserStrategy from "../BankParserStrategy.js";
import { isDateShort } from "../utils/regexUtils.js";
import { PDFExtract } from 'pdf.js-extract';

// Concrete Strategy(A) for Kaspi bank(give me my money)
export default class KaspiBankStrategy extends BankParserStrategy {
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

                const dateItems = content.filter(item => isDateShort(item.str));

                for (const dateItem of dateItems) {
                    const dateY = dateItem.y;
                    const dateStr = dateItem.str;

                    const rowItems = content.filter(item => Math.abs(item.y - dateY) < 5);

                    // if we don't have enough items, skip iit
                    if (rowItems.length < 4) continue;

                    // amount based on T
                    const amountItem = rowItems.find(item => item.str.includes("₸"));
                    if (!amountItem) continue;

                    // Parse it
                    const amount = parseFloat(amountItem.str.replace(/[-+₸ ]/g, "").replace(/\s/g, "").replace(",", "."));

                    rowItems.sort((a, b) => a.x - b.x);

                    // transaction type and details
                    let transactionType = "";
                    let details = "";

                    const amountIndex = rowItems.findIndex(item => item === amountItem);
                    if (amountIndex + 1 < rowItems.length) {
                        transactionType = rowItems[amountIndex + 1].str;
                    }

                    if (amountIndex + 2 < rowItems.length) {
                        details = rowItems[amountIndex + 2].str;
                    }

                    // transaction type
                    const type = transactionType === "Replenishment" ? "INCOME" : "EXPENSE";

                    // to iso
                    const [day, month, year] = dateStr.split(".");
                    const fullYear = year.length === 2 ? `20${year}` : year;
                    const isoDate = new Date(`${fullYear}-${month}-${day}`).toISOString();

                    transactions.push({
                        createdAt: isoDate,
                        amount: amount,
                        type: type,
                        title: details
                    });
                }
            }

            return transactions;
        } catch (error) {
            return []; // no worries
        }
    }
}