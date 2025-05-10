import express from 'express';
import * as authController from '../controllers/authControllers';

const router = express.Router();

router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/callback', authController.authCallback);
router.post('/api/auth/secret', authController.secret);
router.post('/api/auth/register', authController.register);

export default router;
