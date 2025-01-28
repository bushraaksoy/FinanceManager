import prisma from '../db/db.config.js';
import bcrypt from 'bcrypt';
class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
            const isMatch = bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).send({
                    message: 'Logged in successfully',
                    userId: user.id,
                });
            }
        } catch (error) {
            console.log('Server error in login: ', error);
            res.status(500).send({ message: 'Server Error', error: error });
        }
    }
    static async register(req, res) {
        try {
            const body = req.body;
            const hash = await bcrypt.hash(body.password, 10);
            console.log(hash);
            const user = await prisma.user.create({
                data: {
                    username: body.username,
                    password: hash,
                },
            });
            console.log('User created successfully', user);
            res.status(200).send({ message: 'User registered successfully!' });
        } catch (error) {
            console.log('Server error in register: ', error);
            res.status(500).send({ message: 'Server Error', error: error });
        }
    }
}

export default AuthController;
