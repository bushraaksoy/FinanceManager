import prisma from '../db/db.config.js';
import { calculateMonthlySaving } from '../utils/savingUtils.js';

class SavingController {
    static async getAllSavings(req, res) {
        try {
            const userId = req.userId;
            const savings = await prisma.saving.findMany({ where: { userId } });
            res.status(200).send({ savings: savings });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async getSaving(req, res) {
        try {
            const userId = req.userId;
            const { savingId } = req.params;

            const saving = await prisma.saving.findUnique({
                where: { id: +savingId, userId },
            });
            res.status(200).send({ saving });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async addSaving(req, res) {
        try {
            const userId = req.userId;
            const data = req.body;
            console.log('data ', data);
            const savedAmount = 0;
            // TODO: saved_amount = 0 (defualt) calculate MonthlySaving
            const monthlySaving = calculateMonthlySaving(
                data.targetAmount,
                savedAmount,
                data.dueDate
            );
            const saving = await prisma.saving.create({
                data: { ...data, savedAmount, monthlySaving, userId },
            });
            res.status(200).send({
                message: 'Saving added successfully!',
                saving,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async updateSaving(req, res) {
        try {
            const userId = req.userId;
            const { savingId } = req.params;
            const data = req.body;
            const saving = await prisma.saving.update({
                where: { id: +savingId, userId },
                data,
            });
            res.status(200).send({
                message: 'Saving updated successfully!',
                saving,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
    static async deleteSaving(req, res) {
        try {
            const { savingId } = req.params;
            const saving = await prisma.saving.delete({
                where: { id: +savingId, userId },
            });
            res.status(200).send({
                message: 'Saving deleted successfully',
                saving,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
            });
        }
    }
}

export default SavingController;
