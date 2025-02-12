import prisma from '../db/db.config.js';

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json(users);
        } catch (error) {
            console.log(error.message);

            res.status(500).json({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async getUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: 'Server Error',
                error: error.message,
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const data = req.body;
            const user = await prisma.user.update({
                where: { id: userId },
                data,
            });

            console.log('User updated successfully!', user);
            res.status(200).send({});
        } catch (error) {
            console.log('Server Error: ', error);
            res.status(500).send('An error occured');
        }
    }
}

export default UserController;
