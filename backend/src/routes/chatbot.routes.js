import express from 'express';
import { chat, getHistory, clearHistory } from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/:hospitalId/message', chat);
router.get('/:hospitalId/history', getHistory);
router.delete('/:hospitalId/history', clearHistory);

export default router;
