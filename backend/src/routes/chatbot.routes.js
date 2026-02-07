import express from 'express';
import {
  chat,
  getHistory,
  clearHistory,
  getSession,
  requestHuman,
  switchToAI,
  sendUserMsg,
  getAdminChats,
  getAdminChatById,
  adminAcceptChat,
  adminSendMessage,
  adminCloseChat,
  adminMarkRead,
} from '../controllers/chatbot.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public chat endpoints (for hospital visitors)
router.post('/:hospitalId/message', chat);
router.get('/:hospitalId/history', getHistory);
router.delete('/:hospitalId/history', clearHistory);
router.get('/:hospitalId/session', getSession);
router.post('/:hospitalId/request-human', requestHuman);
router.post('/:hospitalId/switch-to-ai', switchToAI);
router.post('/:hospitalId/user-message', sendUserMsg);

// Admin chat endpoints (requires authentication)
router.get('/admin/chats', authenticate, getAdminChats);
router.get('/admin/chats/:chatId', authenticate, getAdminChatById);
router.post('/admin/chats/:chatId/accept', authenticate, adminAcceptChat);
router.post('/admin/chats/:chatId/message', authenticate, adminSendMessage);
router.post('/admin/chats/:chatId/close', authenticate, adminCloseChat);
router.post('/admin/chats/:chatId/mark-read', authenticate, adminMarkRead);

export default router;
