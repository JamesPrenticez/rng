import express from 'express';

const router = express.Router();

import authRoutes from './auth-routes';
import messageRoutes from './message-routes';
import conversationRoutes from './conversation-routes';
import contactsRoutes from './contacts-routes';
import usersRoutes from './users-routes';
import pages from './pages';

router.use(
  pages,
  authRoutes,
  messageRoutes,
  conversationRoutes,
  contactsRoutes,
  usersRoutes
);

export default router;
