import path from 'path';
import express from 'express';
import { type Request, type Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
