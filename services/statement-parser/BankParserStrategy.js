// INTERFACE(fake one) -> there's no interface in JS, so this will act like interface;
export default class BankParserStrategy {
    async processTransactions(rows) {
        throw new Error('processTransactions method must be implemented');
    }

    setPdfPath(path) {
        this.pdfPath = path;
    }
}