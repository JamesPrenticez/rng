import express from 'express';
import * as contactController from '../controllers/contactsControllers';

const router = express.Router();

router.get('/api/contacts/:userId', contactController.getContacts);
router.post('/api/contacts/add', contactController.addContact);

export default router;
