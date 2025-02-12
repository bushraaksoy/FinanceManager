class AnalyticsController {
    static async getTotalIncome(req, res) {
        try {
            const userId = req.headers['user-id'];
            const totalIncome = await prisma.income.aggregate({
                where: { userId },
                _sum: { amount: true },
            });
            res.status(200).send({ totalIncome });
        } catch (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send({ error: 'A server error occured' });
        }
    }

    static async getTotalExpenses(req, res) {
        try {
            const userId = req.headers['user-id'];
            const totalExpenses = await prisma.income.aggregate({
                where: { userId, ExpenseType: 'FIXED' },
                _sum: { amount: true },
            });
            res.status(200).send({ totalExpenses });
        } catch (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send({ error: 'A server error occured' });
        }
    }

    // static async getBalanceOverview(req, res) {
    //     try {
    //         const userId = req.headers['user-id'];
    //         const totalIncome = await prisma.income.aggregate({
    //             where: { userId },
    //             _sum: { amount: true },
    //         });
    //         const totalExpenses = await prisma.income.aggregate({
    //             where: { userId },
    //             _sum: { amount: true },
    //         });
    //         // expenses should be count of unique fixed expenses, but nahhhh, i def need another table for sure, waittt it should be all expenses that have been stored in previous month
    //         const currentBalance = totalIncome - totalExpenses;
    //         res.status(200).send({
    //             totalIncome,
    //             totalExpenses,
    //             currentBalance,
    //         });
    //     } catch (error) {
    //         console.log(`error: ${error.message}`);
    //         res.status(500).send({ error: 'A server error occured' });
    //     }
    // }
}

export default AnalyticsController;
