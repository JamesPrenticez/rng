import express from 'express';
import * as messageController from '../controllers/messageControllers';

const router = express.Router();

router.get('/api/messages', messageController.getMessages);

export default router;
