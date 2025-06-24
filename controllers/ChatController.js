import prisma from '../db/db.config.js';
import { fetchUserFinanceData } from '../services/insightsService.js';
import { formatDate } from '../utils/formatters.js';
import { getChatCompletion } from '../utils/openai.js';
import fs from 'fs';
import path from 'path';

class ChatController {
    static async initializeSession(req, res) {
        const promptPath = path.join(
            process.cwd(),
            'utils',
            'prompts',
            'financial-assistant.md'
        );

        try {
            // create session in db
            // send first text about finance assistant role - let it know that it will receive data
            // send second message about app features
            // send third  message about users data
            // when user requests insight, send only last months data(transactions only?) as fresh data for the assistant.
            // how often to update the userData message????

            const userId = req.userId;
            const assistantPrompt = fs.readFileSync(promptPath, 'utf-8');

            const session = await prisma.chatSession.create({
                data: { userId },
            });

            await prisma.message.create({
                data: {
                    content: assistantPrompt,
                    role: 'developer',
                    sessionId: session.id,
                },
            });

            return res.status(200).send({
                message: 'Session initialized!',
                sessionId: session.id,
            });
        } catch (error) {
            console.log('Error initializing user chat session: ', error);
            return res.status(500).send({
                message: 'Error initializing user chat session',
                error: error.message,
            });
        }
    }

    static async sendMessage(req, res) {
        try {
            const { sessionId, message } = req.body;
            const userId = req.userId;
            let session = await prisma.chatSession.findUnique({
                where: { id: sessionId, userId },
            });

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            const userMessage = await prisma.message.create({
                data: {
                    content: message,
                    role: 'user',
                    sessionId: session.id,
                },
            });

            const messages = await prisma.message.findMany({
                where: { sessionId: session.id },
                orderBy: { createdAt: 'asc' },
            });

            const formattedMessages = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const botReply = await getChatCompletion(formattedMessages);

            if (!botReply) {
                return res.status(500).send({
                    message: 'No reply from assistant',
                });
            }

            const assistantMessage = await prisma.message.create({
                data: {
                    content: botReply.content,
                    role: 'assistant',
                    sessionId: session.id,
                },
            });

            return res.status(200).send({
                sessionId: session.id,
                assistantMessage,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error sending message',
                error: error.message,
            });
        }
    }

    static async getInsights(req, res) {
        const promptPath = path.join(
            process.cwd(),
            'utils',
            'prompts',
            'generate-insights.md'
        );

        try {
            const userId = req.userId;
            const sessionId = req.query['sessionId'];
            const assistantPrompt = fs.readFileSync(promptPath, 'utf-8');

            if (!sessionId) {
                return res.status(404).send({ error: 'sessionId is missing' });
            }

            console.log(sessionId);

            let session = await prisma.chatSession.findUnique({
                where: { id: sessionId, userId },
            });

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            let userData = await fetchUserFinanceData(userId);

            const developerInstruction = await prisma.message.create({
                data: {
                    role: 'developer',
                    content: `${assistantPrompt}\n\nBelow is the user's data:\n${userData}`,
                    sessionId: session.id,
                },
            });

            const messages = await prisma.message.findMany({
                where: { sessionId: session.id },
                orderBy: { createdAt: 'asc' },
            });

            const formattedMessages = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const botReply = await getChatCompletion(formattedMessages);

            if (!botReply) {
                return res.status(500).send({
                    message: 'No reply from assistant',
                });
            }

            const assistantMessage = await prisma.message.create({
                data: {
                    role: 'assistant',
                    content: botReply.content,
                    sessionId: session.id,
                },
            });

            return res.status(200).send({ sessionId, assistantMessage });
        } catch (error) {
            console.log('Error getting user financial insights: ', error);
            return res.status(500).send({
                message: 'Error getting user financial insights',
                error: error.message,
            });
        }
    }

    static async getChatSessions(req, res) {
        try {
            const userId = req.userId;
            let sessions = await prisma.chatSession.findMany({
                where: { userId },
            });

            sessions = sessions.map((session) => ({
                ...session,
                createdAt: formatDate(session.createdAt),
            }));

            return res.status(200).send(sessions);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Server Error' });
        }
    }

    static async getMessages(req, res) {
        try {
            const messages = await prisma.message.findMany();
            return res.status(200).send(messages);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Server Error' });
        }
    }

    static async getSessionMessages(req, res) {
        try {
            // Verify sessionId middleware
            const { sessionId } = req.params;
            console.log(sessionId);
            const messages = await prisma.message.findMany({
                where: {
                    sessionId,
                    role: { in: ['user', 'assistant'] },
                },
                orderBy: { createdAt: 'asc' },
            });
            console.log(messages);
            return res.status(200).send(messages);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Server Error' });
        }
    }

    static async deleteSessions(req, res) {
        try {
            await prisma.message.deleteMany();
            const sessions = await prisma.chatSession.deleteMany();

            return res.status(200).send({
                message: ` ${sessions.count} sessions deleted successfully`,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Server Error' });
        }
    }

    static async deleteMessage(req, res) {
        try {
            const messageId = req.params['messageId'];

            await prisma.message.delete({ where: { id: messageId } });
            return res
                .status(200)
                .send({ message: 'Message deleted successfully' });
        } catch (error) {
            console.log('Error deleting chat message', error);
            return res.status(500).send({
                message: 'Error deleting chat message',
                error: error.message,
            });
        }
    }

    static async deleteSession(req, res) {
        try {
            const sessionId = req.params['sessionId'];
            await prisma.message.deleteMany({ where: { sessionId } });
            const sessions = await prisma.chatSession.delete({
                where: { id: sessionId },
            });

            return res.status(200).send({
                message: ` ${sessions.count} session deleted successfully`,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Server Error' });
        }
    }

    static async getUserData(req, res) {
        try {
            const userId = req.userId;
            const data = await fetchUserFinanceData(userId);
            console.log(data);
            res.status(200).send({ message: 'Check user data in console.' });
        } catch (error) {
            console.log('Error getting user data: ', error);
            return res
                .status(500)
                .send({ message: 'Server error getting user data' });
        }
    }

    static async insertSessionMessages(req, res) {
        try {
            const chatMessages = req.body.messages;
            const userId = req.body.userId;
            await prisma.message.createMany({
                where: userId,
                data: chatMessages,
            });
            return res.status(200).send({ message: 'added successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'server error' });
        }
    }
}

export default ChatController;
