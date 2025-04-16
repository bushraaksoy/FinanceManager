export default class BankStatementParser {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async parseStatement(path) {
        try {
            if (typeof this.strategy.setPdfPath === 'function') {
                this.strategy.setPdfPath(path);
            }

            const transactions = await this.strategy.processTransactions([]);
            return transactions;
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw error;
        }
    }
}