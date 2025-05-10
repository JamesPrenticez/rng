import express from 'express';
import * as testController from '../controllers/testControllers';

const router = express.Router();

router.get('/api/test', testController.test);

export default router;
