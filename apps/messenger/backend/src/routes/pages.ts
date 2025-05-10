import path from 'path';
import express from 'express';
import { type Request, type Response } from 'express';
import { apiDocs } from '../api-docs/docs';

const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
  res.json(apiDocs);
});

export default router;
