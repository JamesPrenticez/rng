import express from 'express';

const router = express.Router();

import testRoutes from './testRoutes';

router.use(testRoutes);

export default router;
