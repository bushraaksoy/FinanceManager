import prisma from '../db/db.config.js';
import { formatDate } from '../utils/formatters.js';

class ProfileController {
    static async getUserProfile(req, res) {
        try {
            const userId = req.headers['user-id'];
            // const userId = req.user.userId;

            if (!userId) {
                return res.status(400).send({ error: 'User ID is missing' });
            }

            const profile = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    fullname: true,
                    username: true,
                    email: true,
                    dob: true,
                    gender: true,
                },
            });
            return res
                .status(200)
                .send({ ...profile, dob: formatDate(profile.dob) });
        } catch (error) {
            console.log('Server Error: ', error);
            return res.status(500).send('An error occurred!');
        }
    }

    static async updateUserProfile(req, res) {
        try {
            const userId = req.headers['user-id'];

            if (!userId) {
                return res.status(400).send({ error: 'User ID is missing' });
            }

            const data = req.body;
            let updatedData = data;
            if (data?.dob) {
                const newDate = new Date(data.dob);
                console.log('new date: ', newDate);
                updatedData = { ...updatedData, dob: newDate };
            }

            await prisma.user.update({
                where: { id: userId },
                data: updatedData,
            });
            return res
                .status(200)
                .send({ message: 'User profile updated successfully!' });
        } catch (error) {
            console.log('Server Error: ', error);
            return res.status(500).send('An error occurred!');
        }
    }
}

export default ProfileController;
