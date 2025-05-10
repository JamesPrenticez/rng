import express from 'express';
import * as usersController from '../controllers/usersControllers';

const router = express.Router();

router.get('/api/users', usersController.getUsers);
router.get('/api/user/status', usersController.getUserStatus);
router.post('/api/user', usersController.updateUser);

export default router;
