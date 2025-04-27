import { Router } from 'express';
import ChatController from '../controllers/ChatController.js';
import { authenticateUserId } from '../middleware/authMiddleware.js';

const chatRouter = Router();

chatRouter.get('/sessions', ChatController.getChatSessions);
chatRouter.get('/messages', ChatController.getMessages);
chatRouter.get(
    '/session-messages/:sessionId',
    ChatController.getSessionMessages
);
chatRouter.delete('/sessions', ChatController.deleteSessions);
chatRouter.delete('/message/:messageId', ChatController.deleteMessage);

chatRouter.get(
    '/initialize-session',
    authenticateUserId,
    ChatController.initializeSession
);

chatRouter.get('/insights', authenticateUserId, ChatController.getInsights);

chatRouter.post(
    '/send-message',
    authenticateUserId,
    ChatController.sendMessage
);

export default chatRouter;
