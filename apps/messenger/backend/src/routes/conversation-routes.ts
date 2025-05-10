import express from 'express';
import * as conversationController from '../controllers/conversationControllers';

const router = express.Router();

router.get('/api/conversations', conversationController.getConversations);
router.post('/api/conversations', conversationController.createConversation);

export default router;
