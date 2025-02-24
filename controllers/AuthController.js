import prisma from '../db/db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
class AuthController {
    static async login(req, res) {
        try {
            const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
            const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
            const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
            const REFRESH_TOKEN_EXPIRATION =
                process.env.REFRESH_TOKEN_EXPIRATION;
            console.log('login attempt');
            const { username, password } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    username,
                },
            });
            if (!user) {
                return res.status(401).send({
                    message: 'Invalid username or password',
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('ismatch: ', isMatch);
            if (isMatch) {
                const access_token = jwt.sign(
                    { userId: user.id },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRATION }
                );

                const refresh_token = jwt.sign(
                    { userId: user.id },
                    REFRESH_TOKEN_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRATION }
                );

                console.log(`user ${username} logged in successfully!`);
                return res.status(200).send({
                    message: 'Logged in successfully',
                    userId: user.id,
                    access_token,
                    refresh_token,
                });
            } else {
                console.log('wrong password');
                return res.status(401).send({ message: 'Incorrect password' });
            }
        } catch (error) {
            console.log('Server error in login: ', error);
            res.status(500).send({ message: 'Server Error', error: error });
        }
    }
    static async register(req, res) {
        try {
            const body = req.body;
            console.log(body);
            const existingUser = await prisma.user.findUnique({
                where: { username: body.username },
            });
            if (existingUser) {
                return res.status(409).send({
                    message: 'A user with that username already exists',
                });
            }
            const hash = await bcrypt.hash(body.password, 10);
            const user = await prisma.user.create({
                data: {
                    username: body.username,
                    password: hash,
                },
            });
            console.log('User created successfully');
            res.status(201).send({ message: 'User registered successfully!' });
        } catch (error) {
            console.log('Server error in register: ', error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }

    static async logout(req, res) {
        // get token from body and remove the refresh token from storage and
    }

    static async getToken(req, res) {
        // get refresh token from body, verify it, sign a new access token and send it to the user
    }
}

export default AuthController;
